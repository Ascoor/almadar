<?php

namespace App\Services;

use App\Events\CommentCreated;
use App\Models\Comment;
use App\Models\Contract;
use App\Models\Investigation;
use App\Models\LegalAdvice;
use App\Models\Litigation;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

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

        return $entity->comments()
            ->with('user:id,name')
            ->latest()
            ->get();
    }

    public function addComment(string $module, int $id, string $body, User $user): Comment
    {
        $entity = $this->resolveCommentable($module, $id, 'create');

        $comment = new Comment(['body' => $body]);
        $comment->user()->associate($user);

        $entity->comments()->save($comment);
        $comment->load('user:id,name');

        $this->notifyAssignee($module, $entity, $comment, $user);

        return $comment;
    }

    private function resolveCommentable(string $module, int $id, string $action): Model
    {
        $meta = $this->getModuleMeta($module);

        $this->authorize($meta['permissions'], $action);

        /** @var Model $model */
        $model = $meta['model'];

        return $model::query()
            ->with(['assignedTo:id,name'])
            ->findOrFail($id);
    }

    private function authorize(array $permissions, string $action): void
    {
        $user = auth()->user();
        $allowed = collect($permissions)
            ->contains(fn ($perm) => $user?->can("{$action} {$perm}"));

        abort_if(!$allowed, 403, self::FORBIDDEN_MESSAGE);
    }

    private function notifyAssignee(string $module, Model $entity, Comment $comment, User $actor): void
    {
        $assignee = $entity->assignedTo ?? null;

        if (!$assignee || $assignee->is($actor)) {
            return;
        }

        $meta = $this->getModuleMeta($module);
        $title = (string) ($entity->{Arr::get($meta, 'title_field')} ?? class_basename($entity));
        $actionUrl = rtrim($meta['route'], '/') . '/' . $entity->getKey();

        event(new CommentCreated(
            entity: $entity,
            section: $module,
            assignee: $assignee,
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
}
