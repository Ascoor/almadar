<?php

namespace App\Listeners;

use App\Events\AssignmentCreated;
use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Models\User;
use App\Notifications\AdminNotification;
use Illuminate\Support\Facades\Notification;

class NotifyAdmins
{
    public function handle(OrderCreated|OrderStatusUpdated|AssignmentCreated $event): void
    {
        $admins = User::role('admin')->get();
        $payload = [];
        if ($event instanceof OrderCreated) {
            $payload = [
                'title' => 'طلب جديد',
                'message' => 'تم إنشاء طلب جديد رقم ' . $event->order->order_number,
            ];
        } elseif ($event instanceof OrderStatusUpdated) {
            $payload = [
                'title' => 'تحديث حالة طلب',
                'message' => 'تم تحديث حالة الطلب رقم ' . $event->order->order_number,
            ];
        } else {
            $payload = [
                'title' => 'تكليف جديد',
                'message' => 'تم إنشاء تكليف للطلب رقم ' . $event->assignment->order->order_number,
            ];
        }
        Notification::send($admins, new AdminNotification($payload));
    }
}
