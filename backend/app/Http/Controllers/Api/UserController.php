<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['roles', 'permissions'])->get();
        return response()->json($users);
    }

    public function show($id)
    
        {
    $user = User::with('roles')->findOrFail($id);
    $permissions = $user->getAllPermissions();

    return response()->json([
        'user' => $user,
        'permissions' => $permissions,
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'roles'    => 'array',
            'roles.*'  => 'exists:roles,name',
            'permissions' => 'array',
               'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

            'permissions.*' => 'exists:permissions,name',
        ]);

        $user = User::create([
            'name'  => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        if ($request->has('permissions')) {
            $user->syncPermissions($request->permissions);
        }
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('users_images', 'public');
        $data['image'] = $imagePath;
    }
        return response()->json([
            'message' => 'تم إنشاء المستخدم بنجاح',
            'user' => $user->load(['roles', 'permissions']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'email'    => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:6|confirmed',
            'roles'    => 'array',
            'roles.*'  => 'exists:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('email')) {
            $user->email = $request->email;
        }
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        if ($request->has('permissions')) {
            $user->syncPermissions($request->permissions);
        }

        return response()->json([
            'message' => 'تم تحديث بيانات المستخدم بنجاح',
            'user' => $user->load(['roles', 'permissions']),
        ]);
    }
    public function getAllRoles()
    {
        $roles = Role::all();
        return response()->json($roles);
    }
    public function getAllPermissions()
    {
        $permissions = Permission::all();
        return response()->json($permissions);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (auth()->id() == $user->id) {
            return response()->json(['message' => 'لا يمكنك حذف حسابك الخاص'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'تم حذف المستخدم بنجاح']);
    }
}
