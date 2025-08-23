<?php
namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserDataUpdated implements ShouldBroadcast
{
    use SerializesModels;

    public $userId;
    public $userData;

    public function __construct(User $user)
    {
        $this->userId = $user->id;

        $this->userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'image_url' => $user->image ? asset('storage/' . $user->image) : null,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getPermissionNames(),
        ];
    }

    public function broadcastOn()
    {
        return new PrivateChannel("user.{$this->userId}");
    }

    public function broadcastAs()
    {
        return 'user.data.updated';
    }

    public function broadcastWith()
    {
        return $this->userData;
    }
}
