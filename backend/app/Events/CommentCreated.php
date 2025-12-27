<?php

namespace App\Events;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class CommentCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Model $entity,
        public string $section,
        /** @var Collection<int, User> */
        public Collection $recipients,
        public User $actor,
        public string $title,
        public ?string $actionUrl,
        public Comment $comment,
    ) {
    }

    public function broadcastOn(): Channel
    {
        return new PrivateChannel($this->channelName());
    }

    public function broadcastAs(): string
    {
        return 'CommentCreated';
    }

    public function broadcastWith(): array
    {
        return [
            'entity' => [
                'type' => $this->section,
                'id' => $this->entity->getKey(),
            ],
            'comment' => [
                'id' => $this->comment->getKey(),
                'body' => $this->comment->body,
                'user' => [
                    'id' => $this->comment->user?->getKey(),
                    'name' => $this->comment->user?->name,
                ],
                'created_at' => optional($this->comment->created_at)->toISOString(),
            ],
            'commentCountDelta' => 1,
        ];
    }

    private function channelName(): string
    {
        return sprintf('entity.%s.%s', $this->section, $this->entity->getKey());
    }
}
