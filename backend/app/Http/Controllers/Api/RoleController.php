<?php

namespace App\Http\Controllers\Api;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role as SpatieRole;
use Spatie\Permission\Models\Permission as SpatiePermission;

class RoleController extends Controller
{
    // Get all roles
    public function index()
    {
        $roles = SpatieRole::all();
        return response()->json(['roles' => $roles]);
    }

    // Create a new role
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
        ]);

        $role = SpatieRole::create([
            'name' => $request->name,
        ]);

        return response()->json(['role' => $role], 201);
    }

    // Show a specific role
    public function show($roleId)
    {
        $role = SpatieRole::findOrFail($roleId);
        return response()->json(['role' => $role]);
    }

    // Update a specific role
    public function update(Request $request, $roleId)
    {
        $role = SpatieRole::findOrFail($roleId);
        $role->name = $request->name;
        $role->save();

        return response()->json(['role' => $role]);
    }

    // Delete a specific role
    public function destroy($roleId)
    {
        $role = SpatieRole::findOrFail($roleId);
        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }

    // Assign permission to role
    public function assignPermission(Request $request, $roleId)
    {
        $request->validate([
            'permission' => 'required|string|exists:permissions,name',
        ]);

        $role = SpatieRole::findOrFail($roleId);
        $permission = SpatiePermission::where('name', $request->permission)->first();
        $role->givePermissionTo($permission);

        return response()->json(['message' => 'Permission assigned successfully']);
    }

    // Revoke permission from role
    public function revokePermission(Request $request, $roleId)
    {
        $request->validate([
            'permission' => 'required|string|exists:permissions,name',
        ]);

        $role = SpatieRole::findOrFail($roleId);
        $permission = SpatiePermission::where('name', $request->permission)->first();
        $role->revokePermissionTo($permission);

        return response()->json(['message' => 'Permission revoked successfully']);
    }
}
