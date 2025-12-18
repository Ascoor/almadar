<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Database\Eloquent\Model;

class AssignmentUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Model $entity,
        public string $section,
        public User $assignee,
        public ?int $assignedBy,
        public string $title,
        public ?string $link = null,
    ) {
    }
}
