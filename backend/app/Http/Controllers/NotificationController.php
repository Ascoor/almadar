<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
       public function getUserNotifications()
    {
        $user = auth()->user();  
        $notifications = $user->notifications; 
        
        return response()->json($notifications);
    }
    public function markAsRead($notificationId)
{
    $notification = Notification::find($notificationId);
    if ($notification) {
        $notification->update(['read' => true]);
        return response()->json(['message' => 'Notification marked as read']);
    }
    return response()->json(['message' => 'Notification not found'], 404);
}

}
