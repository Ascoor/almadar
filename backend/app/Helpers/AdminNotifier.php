<?php
namespace App\Helpers;

use App\Events\AdminNotificationEvent;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class AdminNotifier
{
    public static function notifyAll(string $title, string $message, ?string $link = null, ?int $excludeUserId = null)
{
    $admins = User::role('Admin')
        ->when($excludeUserId, fn($query) => $query->where('id', '!=', $excludeUserId))
        ->get();

    foreach ($admins as $admin) {
        $payload = [
            'id' => Str::uuid()->toString(),
            'title' => $title,
            'message' => $message,
            'link' => $link,
            'created_at' => now()->toDateTimeString(),
        ];

        // حفظ الإشعار
        DB::table('notifications')->insert([
            'user_id' => $admin->id,
            'notifiable_id' => $admin->id,
            'notifiable_type' => User::class,
            'title' => $title,
            'message' => $message,
            'link' => $link,
            'read' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // بث الإشعار
        event(new AdminNotificationEvent($payload, $admin->id));
    }
}

}
