<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AssigneeNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $section,
        public string $entityType,
        public int $entityId,
        public string $actorName,
        public ?string $actionUrl = null,
    ) {
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'title' => 'You have been assigned',
            'message' => "You were assigned to {$this->entityType} (#{$this->entityId}) by {$this->actorName}.",
            'action_url' => $this->actionUrl,
            'entity_type' => $this->entityType,
            'entity_id' => $this->entityId,
            'section' => $this->section,
            'event' => 'assigned',
        ];
    }
}
