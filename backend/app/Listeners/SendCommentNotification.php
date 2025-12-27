<?php

namespace App\Listeners;

use App\Events\CommentCreated;
use App\Notifications\CommentNotification;

class SendCommentNotification
{
    public function handle(CommentCreated $event): void
    {
        $event->assignee->notify(new CommentNotification(
            section: $event->section,
            entityType: class_basename($event->entity),
            entityId: (int) $event->entity->getKey(),
            actorName: $event->actor->name ?? 'System',
            title: $event->title,
            actionUrl: $event->actionUrl,
            commentBody: $event->comment->body,
        ));
    }
}
