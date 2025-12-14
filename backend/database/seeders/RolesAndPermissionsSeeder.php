<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $guard = 'api';

        $permissions = [
            'users.read', 'users.create', 'users.update', 'users.disable',
            'roles.read', 'roles.manage',
            'litigations.read', 'litigations.create', 'litigations.update', 'litigations.delete', 'litigations.approve',
            'investigations.read', 'investigations.create', 'investigations.update', 'investigations.delete', 'investigations.approve',
            'contracts.read', 'contracts.create', 'contracts.update', 'contracts.delete', 'contracts.approve',
            'advice.read', 'advice.create', 'advice.update', 'advice.delete', 'advice.approve',
            'docs.create', 'docs.edit', 'docs.export', 'docs.ai_suggest',
            'dashboard.view', 'analytics.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => $guard,
            ]);
        }

        $roles = [
            'موظف' => [
                'scope' => 'SELF',
                'permissions' => [
                    'dashboard.view',
                    'advice.read',
                    'investigations.read',
                    'contracts.read',
                    'litigations.read',
                    'docs.create', 'docs.edit', 'docs.export', 'docs.ai_suggest',
                ],
            ],
            'باحث قانوني' => [
                'scope' => 'DEPARTMENT',
                'permissions' => [
                    'dashboard.view', 'analytics.view',
                    'advice.read', 'advice.create', 'advice.update',
                    'investigations.read', 'investigations.create', 'investigations.update',
                    'contracts.read', 'contracts.create', 'contracts.update',
                    'litigations.read', 'litigations.create', 'litigations.update',
                    'docs.create', 'docs.edit', 'docs.export', 'docs.ai_suggest',
                ],
            ],
            'محامي' => [
                'scope' => 'DEPARTMENT',
                'permissions' => [
                    'dashboard.view', 'analytics.view',
                    'advice.read', 'advice.create', 'advice.update', 'advice.approve',
                    'investigations.read', 'investigations.create', 'investigations.update', 'investigations.approve',
                    'contracts.read', 'contracts.create', 'contracts.update', 'contracts.approve',
                    'litigations.read', 'litigations.create', 'litigations.update', 'litigations.approve',
                    'docs.create', 'docs.edit', 'docs.export', 'docs.ai_suggest',
                ],
            ],
            'رئيس قسم' => [
                'scope' => 'DEPARTMENT',
                'permissions' => [
                    'dashboard.view', 'analytics.view',
                    'advice.read', 'advice.create', 'advice.update', 'advice.delete', 'advice.approve',
                    'investigations.read', 'investigations.create', 'investigations.update', 'investigations.delete', 'investigations.approve',
                    'contracts.read', 'contracts.create', 'contracts.update', 'contracts.delete', 'contracts.approve',
                    'litigations.read', 'litigations.create', 'litigations.update', 'litigations.delete', 'litigations.approve',
                    'docs.create', 'docs.edit', 'docs.export', 'docs.ai_suggest',
                ],
            ],
            'إدارة' => [
                'scope' => 'ALL',
                'permissions' => $permissions,
            ],
        ];

        foreach ($roles as $name => $data) {
            $role = Role::firstOrCreate(['name' => $name, 'guard_name' => $guard]);
            $role->syncPermissions($data['permissions']);
        }

        $department = Department::firstOrCreate(['name' => 'الإدارة العامة']);

        $admin = User::updateOrCreate(
            ['email' => 'admin@almadar.ly'],
            [
                'name' => 'المشرف العام',
                'password' => Hash::make('Admin@12345'),
                'password_changed' => true,
                'department_id' => $department->id,
                'data_scope' => 'ALL',
                'is_active' => true,
            ]
        );
        $admin->syncRoles(['إدارة']);
        $admin->syncPermissions($permissions);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
