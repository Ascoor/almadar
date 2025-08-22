<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;
use Pusher\Pusher;

class BroadcastController extends Controller
{
    public function authenticate(Request $request)
    {
        // تحقق من صلاحية التوكن
        if (Auth::check()) {
            $user = Auth::user();
            return response()->json([
                'auth' => Broadcast::auth($request),
                'user' => $user,
            ]);
        }
        return response()->json(['error' => 'Unauthorized'], 401);
    }
}
