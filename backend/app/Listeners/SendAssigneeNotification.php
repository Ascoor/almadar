<?php

namespace App\Listeners;

use App\Events\AssignmentUpdated;
use App\Notifications\AssigneeNotification;

class SendAssigneeNotification
{
    public function handle(AssignmentUpdated $event): void
    {
        $actorName = auth()->user()?->name ?? 'System';

        $event->assignee->notify(new AssigneeNotification(
            section: $event->section,
            entityType: class_basename($event->entity),
            entityId: (int) $event->entity->getKey(),
            actorName: $actorName,
            actionUrl: $event->link,
        ));
    }
}
