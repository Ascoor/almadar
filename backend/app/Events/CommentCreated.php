<?php

namespace App\Events;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class CommentCreated
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
}
