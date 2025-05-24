<?php
namespace App\Events;
 
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class UserPermissionsUpdated implements ShouldBroadcast
{
    use SerializesModels;

    public $userId;
    public $permissions;


    public function __construct($userId)
    {
        $this->userId = $userId;
        $user = \App\Models\User::findOrFail($userId);
        $this->permissions = $user->getPermissionNames(); // ← 👈 اجلب الصلاحيات الحالية كمصفوفة
    }


    public function broadcastOn()
    {
        return new PrivateChannel("user.{$this->userId}");
    }

    public function broadcastAs()
    {
        return 'permissions.updated';
    }
 public function broadcastWith()
    {
        return [
            'userId' => $this->userId,
            'permissions' => $this->permissions,
        ];
    }

}
