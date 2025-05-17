<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PermissionUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $userId;

    /**
     * @param  int  $userId  الّذي تغيّرت صلاحياته
     */
    public function __construct(int $userId)
    {
        $this->userId = $userId;
    }

    /** اسم القناة التي سيبث عليها */
    public function broadcastOn(): Channel
    {
        // قناة خاصة بكل مستخدم
        return new PrivateChannel("permissions.user.{$this->userId}");
    }

    /** الاسم الذي سيستقبله JS */
    public function broadcastAs(): string
    {
        return 'PermissionUpdated';
    }
}
