<?php

namespace App\Listeners;

use App\Events\AssignmentCreated;
use App\Events\AssignmentStatusUpdated;
use App\Notifications\UserNotification;

class NotifyAssignee
{
    public function handle(AssignmentCreated|AssignmentStatusUpdated $event): void
    {
        $assignment = $event->assignment;
        $payload = [
            'title' => 'تحديث تكليف',
            'message' => $event instanceof AssignmentCreated
                ? 'تم تكليفك بالطلب رقم ' . $assignment->order->order_number
                : 'تم تحديث حالة التكليف للطلب رقم ' . $assignment->order->order_number,
        ];
        $assignment->assignee->notify(new UserNotification($payload));
    }
}
