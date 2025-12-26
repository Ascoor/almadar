<?php

namespace App\Http\Controllers;

use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->get()
            ->map(function (DatabaseNotification $notification) {
                $data = $notification->data ?? [];
                $meta = $data['meta'] ?? [];

                $mergedData = array_merge($data, $meta, [
                    'meta' => $meta,
                    'id' => $notification->id,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at,
                ]);

                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'read_at' => $notification->read_at,
                    'read' => (bool) $notification->read_at,
                    'created_at' => $notification->created_at,
                    'data' => $mergedData,
                ];
            });

        return response()->json(['data' => $notifications]);
    }

    public function markAsRead($id)
    {
        /** @var DatabaseNotification|null $notification */
        $notification = auth()->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        if (!$notification->read_at) {
            $notification->markAsRead();
        }

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead()
    {
        $user = auth()->user();

        $user->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
