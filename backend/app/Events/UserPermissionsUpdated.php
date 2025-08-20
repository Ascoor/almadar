<?php
namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class UserPermissionsUpdated implements ShouldBroadcast
{
    use SerializesModels;

    public function __construct(
        public int $userId,
        public int $version,
        public array $diff = []
    ) {}

    public function broadcastOn()
    {
        return new PrivateChannel("user.{$this->userId}");
    }

    public function broadcastAs()
    {
        return 'permissions.updated';
    }
}
