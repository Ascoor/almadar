<?php

namespace App\Listeners;

use App\Events\EntityActivityRecorded;
use App\Models\User;
use App\Notifications\AdminEntityNotification;

class SendAdminEntityNotification
{
    public function handle(EntityActivityRecorded $event): void
    {
        $permission = "listen {$event->section}";
        $recipients = User::permission($permission)->get();
        $actorName = $event->actorName ?? 'System';

        foreach ($recipients as $admin) {
            $admin->notify(new AdminEntityNotification(
                section: $event->section,
                entityType: class_basename($event->entity),
                entityId: (int) $event->entity->getKey(),
                event: $event->event,
                actorName: $actorName,
                actionUrl: $event->actionUrl,
                title: $event->title,
                message: $event->event === 'created'
                    ? "{$actorName} created a new " . class_basename($event->entity) . " (#{$event->entity->getKey()})."
                    : "{$actorName} updated " . class_basename($event->entity) . " (#{$event->entity->getKey()}).",
            ));
        }
    }
}
