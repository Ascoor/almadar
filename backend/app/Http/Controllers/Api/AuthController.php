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

        $tokenResult = $user->createToken('api_token');
        $token = $tokenResult->accessToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $tokenResult->token->expires_at->diffInSeconds(now()),
            'user' => $user,
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

      $tokenResult = $user->createToken('api_token');
      $token = $tokenResult->accessToken;
      $roles = $user->getRoleNames();
      $permissions = $user->getAllPermissions()->pluck('name');

      return response()->json([
          'access_token' => $token,
          'token_type' => 'Bearer',
          'expires_in' => $tokenResult->token->expires_at->diffInSeconds(now()),
          'user' => $user,
          'roles' => $roles,
          'permissions' => $permissions,
      ]);
}

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return response()->json(['message' => 'Logged out']);
    }
}
