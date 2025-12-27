<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class CommentNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $section,
        public string $entityType,
        public int $entityId,
        public string $actorName,
        public string $title,
        public ?string $actionUrl = null,
        public ?string $commentBody = null,
    ) {
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'تعليق جديد',
            'message' => "{$this->actorName} أضاف تعليقًا على {$this->entityType} (#{$this->entityId}).",
            'action_url' => $this->actionUrl,
            'entity_type' => $this->entityType,
            'entity_id' => $this->entityId,
            'section' => $this->section,
            'event' => 'commented',
            'comment' => $this->commentBody,
            'actor' => $this->actorName,
            'label' => $this->title,
        ];
    }

    public function toDatabase($notifiable): array
    {
        return $this->toArray($notifiable);
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable) + [
            'id' => $this->id,
            'created_at' => now()->toISOString(),
            'read_at' => null,
            'read' => false,
        ]);
    }
}
