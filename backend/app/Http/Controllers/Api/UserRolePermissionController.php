<?php

namespace App\Http\Controllers\Api;

use App\Events\UserPermissionsUpdated;
use App\Models\User; 
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Str;

class UserRolePermissionController extends Controller
{
// التحقق من حالة الصلاحية للمستخدم
public function permissions($userId)
{
    $user = User::findOrFail($userId);
    $permissions = $user->getAllPermissions();
    return response()->json(['permissions' => $permissions]);
}

// تعيين دور للمستخدم
public function assignRole(Request $request, $userId)
{
    $request->validate([
        'role' => 'required|string|exists:roles,name',
    ]);

    $user = User::findOrFail($userId);
    $role = Role::findByName($request->role);
    $user->assignRole($role);

    return response()->json(['message' => 'Role assigned successfully']);
}

// إزالة دور من المستخدم
public function removeRole(Request $request, $userId)
{
    $request->validate([
        'role' => 'required|string|exists:roles,name',
    ]);

    $user = User::findOrFail($userId);
    $user->removeRole($request->role);

    return response()->json(['message' => 'Role removed successfully']);
}
// إعطاء صلاحية للمستخدم
public function givePermission(Request $request, $userId)
{
    $request->validate([
        'permission' => 'required|string|exists:permissions,name',
    ]);

    $user = User::findOrFail($userId);
    $permission = Permission::where('name', $request->permission)->first();
    $user->givePermissionTo($permission);

    return response()->json(['message' => 'Permission granted successfully']);
}

// إلغاء صلاحية من المستخدم
public function revokePermission(Request $request, $userId)
{
    $request->validate([
        'permission' => 'required|string|exists:permissions,name',
    ]);

    $user = User::findOrFail($userId);
    $permission = Permission::where('name', $request->permission)->first();
    $user->revokePermissionTo($permission);

    return response()->json(['message' => 'Permission revoked successfully']);
}
public function changeUserPermission(Request $request, $userId)
{
    $request->validate([
        'permission' => 'required|string|exists:permissions,name',
        'action' => 'required|in:add,remove',
    ]);

    $user = User::with('roles')->findOrFail($userId);
    $permission = Permission::where('name', $request->permission)->first();

    if ($request->action === 'add') {
        $user->givePermissionTo($permission);
    } else {
        $user->revokePermissionTo($permission);

        if (Str::endsWith($permission->name, '.read')) {
            $section = Str::beforeLast($permission->name, '.read');
            foreach (['create', 'update', 'delete', 'approve'] as $action) {
                $related = $section . '.' . $action;

                if ($user->hasDirectPermission($related)) {
                    $user->revokePermissionTo($related);
                }
            }
        }
    }

    // ✅ إرسال الحدث مرة واحدة فقط بعد انتهاء التعديلات
    event(new  UserPermissionsUpdated($user->id));
    return response()->json(['message' => 'Permission updated successfully']);
}

}