<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view permissions')->only(['index', 'show']);
        $this->middleware('permission:create permissions')->only('store');
        $this->middleware('permission:edit permissions')->only('update');
        $this->middleware('permission:delete permissions')->only('destroy');
    }

    public function index()
    {
        return response()->json(Permission::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        $permission = Permission::create(['name' => $validated['name']]);

        return response()->json(['message' => 'Permission created successfully', 'permission' => $permission]);
    }

    public function show($id)
    {
        $permission = Permission::findOrFail($id);
        return response()->json($permission);
    }

    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update(['name' => $validated['name']]);

        return response()->json(['message' => 'Permission updated successfully', 'permission' => $permission]);
    }

    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return response()->json(['message' => 'Permission deleted successfully']);
    }
    // عرض جميع صلاحيات مستخدم معين
public function permissions($userId)
{
    $user = \App\Models\User::findOrFail($userId);
    $permissions = $user->getAllPermissions();

    return response()->json([
        'permissions' => $permissions,
    ]);
}

}
