<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function getUserNotifications()
    {
        $user = auth()->user();
        return response()->json($user->notifications);
    }

    public function markAsRead($notificationId)
    {
        $user = auth()->user();

        // Make sure the notification belongs to this user
        $notification = $user->notifications()->where('id', $notificationId)->first();

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notification->markAsRead(); // sets read_at
        return response()->json(['message' => 'Notification marked as read']);
    }
}
