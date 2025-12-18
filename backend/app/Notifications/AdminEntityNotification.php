<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdminEntityNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $section,
        public string $entityType,
        public int $entityId,
        public string $event,
        public string $actorName,
        public ?string $actionUrl = null,
        public ?string $title = null,
        public ?string $message = null,
    ) {
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        $resolvedTitle = $this->title ?? ($this->event === 'created'
            ? "New {$this->section} created"
            : "{$this->section} updated");

        $resolvedMessage = $this->message ?? ($this->event === 'created'
            ? "{$this->actorName} created a new {$this->entityType} (#{$this->entityId})."
            : "{$this->actorName} updated {$this->entityType} (#{$this->entityId}).");

        return [
            'title' => $resolvedTitle,
            'message' => $resolvedMessage,
            'action_url' => $this->actionUrl,
            'entity_type' => $this->entityType,
            'entity_id' => $this->entityId,
            'section' => $this->section,
            'event' => $this->event,
        ];
    }
}
