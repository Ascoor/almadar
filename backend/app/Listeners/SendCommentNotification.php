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
        foreach (($event->recipients ?? []) as $recipient) {
            $recipientId = (int) $recipient->getKey();
            $commentId   = (int) $event->comment->getKey();

            // Dedup key per (comment, recipient)
            $dedupKey = "comment:{$commentId}:user:{$recipientId}";

            // Lock to avoid double-send on retries / concurrent workers
            Cache::lock("{$dedupKey}:lock", 10)->block(5, function () use ($dedupKey, $recipient, $event, $commentId): void {
                if (Cache::has($dedupKey)) {
                    return;
                }

                $recipient->notify(new CommentNotification(
                    section: $event->section,
                    entityType: class_basename($event->entity),
                    entityId: (int) $event->entity->getKey(),
                    actorName: $event->actor->name ?? 'System',
                    title: $event->title,
                    actionUrl: $event->actionUrl,
                    commentBody: $event->comment->body,
                    commentId: $commentId,
                ));

                // لا تستخدم forever (أفضل TTL لمنع تضخم الكاش)
                Cache::put($dedupKey, true, now()->addDays(30));
            });
        }
    }
}
