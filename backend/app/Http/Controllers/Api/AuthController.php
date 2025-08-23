<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

public function login(Request $request)
{
    $request->validate([
        'email'    => 'required|string|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Bad credentials'], 401);
    }

    // إنشاء التوكن
    $token = $user->createToken('api_token')->plainTextToken;

    // جلب الأدوار والصلاحيات
    $roles       = $user->getRoleNames();            // يعيد Collection من أسماء الأدوار
    $permissions = $user->getAllPermissions()        // يعيد Collection من Permission models
                        ->pluck('name');             // نأخذ فقط الأسماء

    return response()->json([
        'user'        => $user,
        'token'       => $token,
        'roles'       => $roles,
        'permissions' => $permissions,
    ]);
}

    public function user(Request $request)
    {
        $user = $request->user();

        $roles = $user->getRoleNames();
        $permissions = $user->getAllPermissions()->pluck('name');

        return response()->json([
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }
}
