<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class AssignmentUpdatedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $context,
        public string $entityTitle,
        public ?string $link = null,
        public ?int $entityId = null,
        public ?string $entityType = null,
        public ?int $assignedBy = null,
    ) {}

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        // ✅ هذا هو الذي يُخزن في جدول Laravel notifications (data)
        return [
            'key' => 'assignment.updated',
            'title_key' => 'notifications.assignment.title',
            'message_key' => 'notifications.assignment.message',
            'params' => [
                'context' => $this->context,
                'title'   => $this->entityTitle,
            ],
            'link' => $this->link,
            'meta' => [
                'entity_id'   => $this->entityId,
                'entity_type' => $this->entityType,
                'assigned_by' => $this->assignedBy,
            ],
        ];
    }
    public function toDatabase($notifiable): array
    {
        return $this->toArray($notifiable);
    }
    
    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->toArray($notifiable) + [
            'id' => $this->id,                 // ✅ نفس ID في جدول notifications
            'created_at' => now()->toISOString(),
        ]);
    }
}       