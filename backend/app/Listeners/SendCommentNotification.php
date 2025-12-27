<?php

namespace App\Listeners;

use App\Events\CommentCreated;
use App\Notifications\CommentNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Cache;

class SendCommentNotification implements ShouldQueue
{
    public function handle(CommentCreated $event): void
    {
        $recipientId = $event->assignee->getKey();
        $commentId = $event->comment->getKey();
        $dedupKey = sprintf('comment:%d:user:%d', $commentId, $recipientId);

        Cache::lock("{$dedupKey}:lock", 10)->block(5, function () use ($dedupKey, $event): void {
            if (Cache::has($dedupKey)) {
                return;
            }

            $event->assignee->notify(new CommentNotification(
                section: $event->section,
                entityType: class_basename($event->entity),
                entityId: (int) $event->entity->getKey(),
                actorName: $event->actor->name ?? 'System',
                title: $event->title,
                actionUrl: $event->actionUrl,
                commentBody: $event->comment->body,
                commentId: (int) $event->comment->getKey(),
            ));

            Cache::forever($dedupKey, true);
        });
    }
}
