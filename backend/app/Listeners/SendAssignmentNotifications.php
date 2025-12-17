<?php

namespace App\Listeners;

use App\Events\AssignmentCreated;
use App\Events\AssignmentStatusUpdated;
use App\Models\User;
use App\Notifications\AdminNotification;
use App\Notifications\UserNotification;
use Illuminate\Support\Facades\Notification;

class SendAssignmentNotifications
{
    public function handle(AssignmentCreated|AssignmentStatusUpdated $event): void
    {
        $assignment = $event->assignment;
        $admins = User::role('admin')->get();

        if ($event instanceof AssignmentCreated) {
            Notification::send($admins, new AdminNotification('تكليف جديد', 'تم إنشاء تكليف جديد للطلب ' . $assignment->order->order_number));
            $assignment->assignee->notify(new UserNotification('تم تعيينك على طلب', 'تم تعيينك على طلب رقم ' . $assignment->order->order_number));
        }

        if ($event instanceof AssignmentStatusUpdated) {
            Notification::send($admins, new AdminNotification('تحديث حالة تكليف', 'تم تحديث حالة التكليف للطلب ' . $assignment->order->order_number . ' إلى ' . $assignment->status->value));
            $assignment->assignee->notify(new UserNotification('تحديث حالة تكليفك', 'تم تحديث حالة التكليف إلى ' . $assignment->status->value));
        }
    }
}
