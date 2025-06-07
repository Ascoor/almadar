<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // 1. مسح كاش الصلاحيات
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. تعريف كل الصلاحيات
        $modules = [
            'legaladvices'             => ['view', 'create', 'edit', 'delete'],
            'litigations'             => ['view', 'create', 'edit', 'delete'], 
            'litigation-from'         => ['view', 'create', 'edit', 'delete'], 
            'litigation-from-actions' => ['view', 'create', 'edit', 'delete'], 
            'litigation-against'      => ['view', 'create', 'edit', 'delete'], 
            'litigation-against-actions' => ['view', 'create', 'edit', 'delete'], 
            'contracts'               => ['view', 'create', 'edit', 'delete'],
            'investigations'          => ['view', 'create', 'edit', 'delete'],
            'investigation-actions'   => ['view', 'create', 'edit', 'delete'],
            'users'                   => ['view', 'create', 'edit', 'delete'],
            'managment-lists'         => ['view', 'create', 'edit', 'delete'],
            'roles'                   => ['view', 'create', 'edit', 'delete'],
            'permissions'             => ['view', 'create', 'edit', 'delete'],
            'reports'             => ['view', 'create', 'edit', 'delete'],
            'profile'                 => ['view', 'edit'],
        ];

        // 3. إنشاء الصلاحيات
        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$action} {$module}",
                    'guard_name' => 'api',
                ]);
            }
        }

        // 4. إنشاء الدور: Admin
        $adminRole = Role::firstOrCreate([
            'name' => 'Admin',
            'guard_name' => 'api',
        ]);
        $adminRole->syncPermissions(Permission::all()); // كل الصلاحيات

        // 5. إنشاء الدور: Moderator
        $moderatorRole = Role::firstOrCreate([
            'name' => 'Moderator',
            'guard_name' => 'api',
        ]);
        $moderatorRole->syncPermissions([]); // بدون صلاحيات إطلاقًا

        // 6. إنشاء الدور: User
        $userRole = Role::firstOrCreate([
            'name' => 'User',
            'guard_name' => 'api',
        ]);
        $userRole->syncPermissions([]); // بدون صلاحيات إطلاقًا
    }
}
