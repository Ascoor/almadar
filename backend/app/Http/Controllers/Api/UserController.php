<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

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
            'image_url' => $user->image ? asset('storage/' . $user->image) : null,
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
            'permissions.*' => 'exists:permissions,name',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        if ($request->has('permissions')) {
            $user->syncPermissions($request->permissions);
        }

        if ($request->hasFile('image')) {
            $extension = $request->file('image')->getClientOriginalExtension();
            $filename = "user-{$user->id}." . $extension;
            $path = $request->file('image')->storeAs('users_images', $filename, 'public');
            $user->image = $path;
            $user->save();
        }

        return response()->json([
            'message' => 'تم إنشاء المستخدم بنجاح',
            'user' => $user->load(['roles', 'permissions']),
            'image_url' => $user->image ? asset('storage/' . $user->image) : null,
        ], 201);
    }

  public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'email'    => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6|confirmed',
            'roles'    => 'array',
            'roles.*'  => 'exists:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user->fill($request->only('name', 'email'));

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

   if ($request->hasFile('image')) {
    // حذف الصورة القديمة إذا كانت موجودة فعلاً في public/
    if ($user->image && file_exists(public_path($user->image))) {
        unlink(public_path($user->image));
    }

    $file = $request->file('image');
    $filename = "user-{$user->id}." . $file->getClientOriginalExtension();
    $file->move(public_path('users_images'), $filename);
    $user->image = "users_images/{$filename}";
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
            'image_url' => $user->image ? asset('storage/' . $user->image) : null,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if (auth()->id() == $user->id) {
            return response()->json(['message' => 'لا يمكنك حذف حسابك الخاص'], 403);
        }

        if ($user->image && Storage::disk('public')->exists($user->image)) {
            Storage::disk('public')->delete($user->image);
        }

        $user->delete();

        return response()->json(['message' => 'تم حذف المستخدم بنجاح']);
    }

    public function changePassword(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['message' => 'كلمة المرور الحالية غير صحيحة'], 403);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'تم تغيير كلمة المرور بنجاح']);
    }

    public function getAllRoles()
    {
        return response()->json(Role::all());
    }

    public function getAllPermissions()
    {
        return response()->json(Permission::all());
    }
}
