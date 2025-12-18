<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EntityActivityRecorded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Model $entity,
        public string $section,
        public string $event,
        public ?int $actorId,
        public ?string $actorName,
        public ?string $title = null,
        public ?string $actionUrl = null,
    ) {
    }
}
