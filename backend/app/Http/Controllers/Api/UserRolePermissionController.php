<?php

namespace App\Http\Controllers\Api;

use App\Events\UserPermissionsUpdated;
use App\Models\User; 
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

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
        // فقط أضف الصلاحية المطلوبة للمستخدم فقط
        $user->givePermissionTo($permission);

    } else {
        // أزل الصلاحية من المستخدم
        $user->revokePermissionTo($permission);

        // أزل الصلاحية من جميع الأدوار المرتبطة به
        foreach ($user->roles as $role) {
            if ($role->hasPermissionTo($permission->name)) {
                $role->revokePermissionTo($permission->name);
            }
        }

        // إن كانت الصلاحية View، أزل باقي الصلاحيات المرتبطة بالقسم أيضًا
        if (str_starts_with($permission->name, 'view ')) {
            $section = explode(' ', $permission->name)[1];
            foreach (['create', 'edit', 'delete'] as $action) {
                $related = "$action $section";

                // من المستخدم
                if ($user->hasPermissionTo($related)) {
                    $user->revokePermissionTo($related);
                }

                // ومن الأدوار المرتبطة به أيضًا
                foreach ($user->roles as $role) {
                    if ($role->hasPermissionTo($related)) {
                        $role->revokePermissionTo($related);
                    }
                }
                
            }
        }
    }

    // ✅ إرسال الحدث مرة واحدة فقط بعد انتهاء التعديلات
    event(new  UserPermissionsUpdated($user->id));
    return response()->json(['message' => 'Permission updated successfully']);
}

}