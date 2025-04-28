<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view users', 'edit users', 'delete users',
            'view roles', 'create roles', 'edit roles', 'delete roles',
            'view permissions', 'create permissions', 'edit permissions', 'delete permissions',
            'assign permission', 'revoke permission', 'assign role to user',
            'view profile',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->syncPermissions(Permission::all());

        $moderator = Role::firstOrCreate(['name' => 'Moderator']);
        $moderator->syncPermissions([
            'view users', 'edit users',
            'view roles',
            'view profile',
        ]);

        $user = Role::firstOrCreate(['name' => 'User']);
        $user->syncPermissions([
            'view profile',
        ]);
    }
}
