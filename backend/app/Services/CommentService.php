<?php

namespace App\Services;

use App\Events\CommentCreated;
use App\Models\Comment;
use App\Models\CommentReceipt;
use App\Models\Contract;
use App\Models\Investigation;
use App\Models\LegalAdvice;
use App\Models\Litigation;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class CommentService
{
    public const FORBIDDEN_MESSAGE = 'لا تملك الصلاحية لإضافة تعليق.';

    private const MODULES = [
        'legal-advices' => [
            'model' => LegalAdvice::class,
            'permissions' => ['legaladvices'],
            'title_field' => 'topic',
            'route' => '/legal/legal-advices',
        ],
        'contracts' => [
            'model' => Contract::class,
            'permissions' => ['contracts'],
            'title_field' => 'number',
            'route' => '/contracts',
        ],
        'investigations' => [
            'model' => Investigation::class,
            'permissions' => ['investigations'],
            'title_field' => 'subject',
            'route' => '/legal/investigations',
        ],
        'litigations' => [
            'model' => Litigation::class,
            'permissions' => ['litigations', 'litigation-from', 'litigation-against'],
            'title_field' => 'case_number',
            'route' => '/litigations',
        ],
    ];

    /**
     * Returns comments formatted for the current viewer.
     */
    public function getComments(string $module, int $id): Collection
    {
        $entity = $this->resolveCommentable($module, $id, 'view');

        /** @var User|null $viewer */
        $viewer = auth()->user();

        return $entity->comments()
            ->with(['user:id,name', 'receipts'])
            ->latest()
            ->get()
            ->map(fn (Comment $comment) => $this->formatCommentForViewer($comment, $viewer));
    }

    public function addComment(string $module, int $id, string $body, User $user): Comment
    {
        $entity = $this->resolveCommentable($module, $id, 'create');

        $comment = new Comment(['body' => $body]);
        $comment->user()->associate($user);

        $entity->comments()->save($comment);
        $comment->load(['user:id,name', 'receipts']);

        // Determine and filter recipients (exclude actor + respect view permission)
        $recipients = $this->determineRecipients($entity, $user);
        $recipients = $this->filterRecipientsByViewPermission($module, $recipients);
        $recipients = $recipients->reject(fn (User $recipient) => (int) $recipient->id === (int) $user->id)->values();

        // Create/update receipts (delivered)
        foreach ($recipients as $recipient) {
            CommentReceipt::updateOrCreate(
                [
                    'comment_id' => $comment->id,
                    'recipient_id' => $recipient->id,
                ],
                [
                    'delivered_at' => now(),
                ]
            );
        }

        // Fire event to send notifications (listener can dedup)
        $this->notifyStakeholders($module, $entity, $comment, $user, $recipients);

        // Reload receipts after writes (optional but nice)
        $comment->load('receipts');

        return $comment;
    }

    /**
     * Mark receipts as read for the authenticated user.
     * You can call it with:
     * - module + id (mark all receipts for that entity),
     * - or explicit commentIds list,
     * - or both.
     */
    public function markAsRead(?string $module, ?int $id, array $commentIds, User $user): void
    {
        $receiptQuery = CommentReceipt::query()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at');

        if ($module && $id) {
            $entity = $this->resolveCommentable($module, $id, 'view');
            $ids = $entity->comments()->pluck('id');

            $receiptQuery->whereIn('comment_id', $ids);
        }

        if (!empty($commentIds)) {
            $receiptQuery->whereIn('comment_id', $commentIds);
        }

        // If neither module/id nor commentIds provided, do nothing
        if (!$module && empty($commentIds)) {
            return;
        }

        $receiptQuery->update(['read_at' => now()]);
    }

    private function resolveCommentable(string $module, int $id, string $action): Model
    {
        $meta = $this->getModuleMeta($module);

        $this->authorize($meta['permissions'], $action);

        /** @var class-string<Model> $model */
        $model = $meta['model'];

        return $model::query()
            ->with(['assignedTo:id,name', 'creator:id,name', 'updater:id,name'])
            ->findOrFail($id);
    }

    private function authorize(array $permissions, string $action): void
    {
        /** @var User|null $user */
        $user = auth()->user();

        $allowed = $this->canAccess($user, $permissions, $action);

        abort_if(!$allowed, 403, self::FORBIDDEN_MESSAGE);
    }

    private function notifyStakeholders(
        string $module,
        Model $entity,
        Comment $comment,
        User $actor,
        Collection $recipients
    ): void {
        if ($recipients->isEmpty()) {
            return;
        }

        $meta = $this->getModuleMeta($module);

        $titleField = Arr::get($meta, 'title_field');
        $title = (string) ($titleField ? ($entity->{$titleField} ?? class_basename($entity)) : class_basename($entity));

        $actionUrl = rtrim($meta['route'], '/') . '/' . $entity->getKey() . '?comment=' . $comment->getKey();

        event(new CommentCreated(
            entity: $entity,
            section: $module,
            recipients: $recipients,
            actor: $actor,
            title: $title,
            actionUrl: $actionUrl,
            comment: $comment,
        ));
    }

    private function getModuleMeta(string $module): array
    {
        $meta = Arr::get(self::MODULES, $module);
        abort_if(!$meta, 404, 'Unknown module');

        return $meta;
    }

    /**
     * codex version (kept): safe permission check even when user is null.
     */
    private function canAccess(?User $user, array $permissions, string $action): bool
    {
        return collect($permissions)->contains(
            fn (string $perm) => $user?->can("{$action} {$perm}") === true
        );
    }

    /**
     * Determine who should receive the comment notification/receipt.
     * - If actor is admin: notify assignee (if exists).
     * - If actor is non-admin: notify admins.
     */
    private function determineRecipients(Model $entity, User $actor): Collection
    {
        if ($this->isAdmin($actor)) {
            return collect($entity->assignedTo ? [$entity->assignedTo] : [])->filter();
        }

        // Support both "admin" and "Admin"
        return User::query()
            ->whereHas('roles', fn ($q) => $q->whereIn('name', ['admin', 'Admin']))
            ->get();
    }

    /**
     * Filter recipients who have 'view' permission for this module.
     */
    private function filterRecipientsByViewPermission(string $module, Collection $recipients): Collection
    {
        $meta = $this->getModuleMeta($module);

        return $recipients->filter(
            fn (User $recipient) => $this->canAccess($recipient, $meta['permissions'], 'view')
        )->values();
    }

    /**
     * Adds a `receipt` field to the comment payload based on the viewer.
     * Viewer can see:
     * - their own receipt, OR
     * - if viewer is the author or admin: a "primary" receipt (first one).
     */
    private function formatCommentForViewer(Comment $comment, ?User $viewer): array
    {
        $receipt = $viewer ? $this->resolveVisibleReceipt($comment, $viewer) : null;

        $base = Arr::except($comment->toArray(), ['receipts']);

        return array_merge($base, [
            'receipt' => $receipt ? [
                'recipient_id' => $receipt->recipient_id,
                'delivered_at' => optional($receipt->delivered_at)->toISOString(),
                'read_at' => optional($receipt->read_at)->toISOString(),
            ] : null,
        ]);
    }

    private function resolveVisibleReceipt(Comment $comment, User $viewer): ?CommentReceipt
    {
        // 1) Viewer sees their own receipt
        $receiptForViewer = $comment->receipts
            ->first(fn (CommentReceipt $receipt) => (int) $receipt->recipient_id === (int) $viewer->id);

        if ($receiptForViewer) {
            return $receiptForViewer;
        }

        // 2) Author sees a primary receipt (first)
        if ((int) $comment->user_id === (int) $viewer->id) {
            return $comment->receipts->first();
        }

        // 3) Admin sees a primary receipt (first)
        if ($this->isAdmin($viewer)) {
            return $comment->receipts->first();
        }

        return null;
    }

    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('Admin');
    }
}
