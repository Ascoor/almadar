<?php

namespace App\Http\Controllers\Api;

use App\Models\User; 
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserRolePermissionController extends Controller
{
    // Get all permissions for a user
    public function permissions($userId)
    {
        $user = User::findOrFail($userId);
        $permissions = $user->getAllPermissions();
        return response()->json(['permissions' => $permissions]);
    }

    // Assign role to a user
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

    // Remove role from a user
    public function removeRole(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user = User::findOrFail($userId);
        $user->removeRole($request->role);

        return response()->json(['message' => 'Role removed successfully']);
    }

    // Give permission to a user
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

    // Revoke permission from a user
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

    // Change a user's permission (optional endpoint if needed)
    public function changeUserPermission(Request $request)
    {
        $request->validate([
            'userId' => 'required|exists:users,id',
            'permission' => 'required|string|exists:permissions,name',
            'action' => 'required|in:add,remove',
        ]);

        $user = User::findOrFail($request->userId);
        $permission = Permission::where('name', $request->permission)->first();

        if ($request->action === 'add') {
            $user->givePermissionTo($permission);
        } else {
            $user->revokePermissionTo($permission);
        }

        return response()->json(['message' => 'Permission updated successfully']);
    }
}
