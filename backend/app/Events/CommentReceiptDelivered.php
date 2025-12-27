<?php

namespace App\Events;

use App\Models\CommentReceipt;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentReceiptDelivered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $entityType,
        public int $entityId,
        public CommentReceipt $receipt,
    ) {
    }

    public function broadcastOn(): Channel
    {
        return new PrivateChannel($this->channelName());
    }

    public function broadcastAs(): string
    {
        return 'CommentReceiptDelivered';
    }

    public function broadcastWith(): array
    {
        return [
            'comment_id' => $this->receipt->comment_id,
            'recipient_id' => $this->receipt->recipient_id,
            'delivered_at' => optional($this->receipt->delivered_at)->toISOString(),
            'read_at' => optional($this->receipt->read_at)->toISOString(),
            'entity_type' => $this->entityType,
            'entity_id' => $this->entityId,
        ];
    }

    private function channelName(): string
    {
        return sprintf('entity.%s.%s', $this->entityType, $this->entityId);
    }
}
