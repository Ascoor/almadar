<?php
namespace App\Helpers;

use App\Events\AdminNotificationEvent;
use App\Models\User;

class AdminNotifier
{
    public static function notifyAll(string $title, string $message, ?string $link = null)
    {
        $admins = User::role('Admin')->get();

        foreach ($admins as $admin) {
            $payload = [
                'id' => uniqid(),
                'title' => $title,
                'message' => $message,
                'link' => $link,
                'created_at' => now()->toDateTimeString(),
            ];

            event(new AdminNotificationEvent($payload, $admin->id));
        }
    }
}
