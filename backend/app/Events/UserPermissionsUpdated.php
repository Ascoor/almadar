<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class UserPermissionsUpdated implements ShouldBroadcast
{
    use SerializesModels;

    public $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new Channel("user.{$this->userId}");
    }

    public function broadcastAs()
    {
        return 'permissions.updated';
    }
}
