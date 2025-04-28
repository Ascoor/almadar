<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
public function index()
{
    return User::all();
}
public function show($id)
{
    return User::find($id);
}
public function destroy($id)
{
    User::find($id)->delete();
    return response()->json(['message' => 'Deleted']);
}
}