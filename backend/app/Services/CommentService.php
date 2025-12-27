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

    public function getComments(string $module, int $id)
    {
        $entity = $this->resolveCommentable($module, $id, 'view');

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
        $comment->load('user:id,name');

        $recipients = $this->determineRecipients($entity, $user);

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

        $this->notifyStakeholders($module, $entity, $comment, $user, $recipients);

        return $comment;
    }

    private function resolveCommentable(string $module, int $id, string $action): Model
    {
        $meta = $this->getModuleMeta($module);

        $this->authorize($meta['permissions'], $action);

        /** @var Model $model */
        $model = $meta['model'];

        return $model::query()
            ->with(['assignedTo:id,name', 'creator:id,name', 'updater:id,name'])
            ->findOrFail($id);
    }

    private function authorize(array $permissions, string $action): void
    {
        $user = auth()->user();
        $allowed = collect($permissions)
            ->contains(fn ($perm) => $user?->can("{$action} {$perm}"));

        abort_if(!$allowed, 403, self::FORBIDDEN_MESSAGE);
    }

    private function notifyStakeholders(string $module, Model $entity, Comment $comment, User $actor, Collection $recipients): void
    {
        $meta = $this->getModuleMeta($module);
        $title = (string) ($entity->{Arr::get($meta, 'title_field')} ?? class_basename($entity));
        $actionUrl = rtrim($meta['route'], '/') . '/' . $entity->getKey();

        if ($recipients->isEmpty()) {
            return;
        }

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

    private function determineRecipients(Model $entity, User $actor): Collection
    {
        if ($this->isAdmin($actor)) {
            return collect($entity->assignedTo ? [$entity->assignedTo] : [])->filter();
        }

        return User::role('admin')->get();
    }

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
        $receiptForViewer = $comment->receipts->first(fn (CommentReceipt $receipt) => $receipt->recipient_id === $viewer->id);

        if ($receiptForViewer) {
            return $receiptForViewer;
        }

        if ($comment->user_id === $viewer->id) {
            return $comment->receipts->first();
        }

        if ($this->isAdmin($viewer)) {
            return $comment->receipts->first();
        }

        return null;
    }

    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('Admin');
    }

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

        $receiptQuery->update(['read_at' => now()]);
    }
}
