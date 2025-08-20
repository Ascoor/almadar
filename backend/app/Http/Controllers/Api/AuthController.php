<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $r)
    {
        $cred = $r->validate(['email'=>'required|email','password'=>'required']);
        if (!auth()->attempt($cred)) return response()->json(['message'=>'Invalid credentials'], 401);
        $user = auth()->user();
        $token = $user->createToken('spa')->accessToken;

        return response()->json(['user'=>$user,'access_token'=>$token]);
    }

    public function me(Request $r)
    {
        $u = $r->user('api');
        return response()->json([
            'user'=>$u,
            'roles'=>$u->getRoleNames(),
            'permissions'=>$u->getAllPermissions()->pluck('name'),
        ]);
    }

    public function logout(Request $r)
    {
        $r->user('api')->token()->revoke();
        return response()->json(['ok'=>true]);
    }
}
