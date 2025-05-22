<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;  // ✅ ضروري لتفعيل البث بشكل رسمي
use Illuminate\Broadcasting\InteractsWithSockets;

class UserPermissionsUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

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
        return 'permissions.updated'; // ← 👈 اسم الحدث الذي تستمع له React
    }

    public function broadcastWith()
    {
        return [
            'userId' => $this->userId,
            'permissions' => $this->permissions,
        ];
    }
}
