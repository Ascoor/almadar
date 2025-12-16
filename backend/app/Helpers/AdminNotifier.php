<?php

namespace App\Helpers;

use App\Events\AdminNotificationEvent;
use App\Models\User;
use App\Notifications\AdminAlertNotification;

class AdminNotifier
{
    public static function notifyAll(string $title, string $message, ?string $link = null, ?int $excludeUserId = null)
    {
        $admins = User::role('Admin')
            ->when($excludeUserId, fn ($q) => $q->where('id', '!=', $excludeUserId))
            ->get();

        foreach ($admins as $admin) {

            // ✅ حفظ في جدول Laravel الافتراضي (notifications)
            $admin->notify(new AdminAlertNotification($title, $message, $link));

            $latest = $admin->notifications()->latest()->first();
            
            event(new AdminNotificationEvent([
                'id' => $latest?->id,
                'title' => $title,
                'message' => $message,
                'link' => $link,
                'created_at' => optional($latest?->created_at)->toDateTimeString() ?? now()->toDateTimeString(),
            ], $admin->id));
        }            
    }
}
