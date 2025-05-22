<?php

namespace App\Helpers;

use App\Models\User;
use App\Models\Notification;

class NotificationHelper
{
    public static function notifyAdmins($title, $message, $link = null)
    {
        $admins = User::whereIn('role', ['admin', 'moderator'])->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => $title,
                'message' => $message,
                'link' => $link,
            ]);
        }
    }
}
