<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Models\User;
use App\Notifications\AdminNotification;
use App\Notifications\UserNotification;
use Illuminate\Support\Facades\Notification;

class SendOrderNotifications
{
    public function handle(OrderCreated|OrderStatusUpdated $event): void
    {
        $order = $event->order;
        $admins = User::role('admin')->get();

        if ($event instanceof OrderCreated) {
            Notification::send($admins, new AdminNotification('طلب جديد', 'تم إنشاء طلب جديد برقم ' . $order->order_number));
        }

        if ($event instanceof OrderStatusUpdated) {
            Notification::send($admins, new AdminNotification('تحديث حالة طلب', 'تم تحديث حالة الطلب ' . $order->order_number . ' إلى ' . $order->status->value));
            $order->user->notify(new UserNotification('تحديث حالة طلبك', 'تم تحديث حالة طلبك إلى ' . $order->status->value));
        }
    }
}
