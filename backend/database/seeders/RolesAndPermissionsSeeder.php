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
        // تفريغ كاش الصلاحيات
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // تعريف الوحدات والصلاحيات المرتبطة بها
        $modules = [
            'legaladvices'             => ['view', 'create', 'edit', 'delete'],
            'litigation-against'       => ['view', 'create', 'edit', 'delete'],
            'litigation-from'          => ['view', 'create', 'edit', 'delete'],
            'contracts-local'          => ['view', 'create', 'edit', 'delete'],
            'contracts-international'  => ['view', 'create', 'edit', 'delete'],
            'investigations'           => ['view', 'create', 'edit', 'delete'],
            'users'                    => ['view', 'create', 'edit', 'delete'],
            'roles'                    => ['view', 'create', 'edit', 'delete'],
            'permissions'              => ['view', 'create', 'edit', 'delete'],
            'profile'                  => ['view','edit'],
        ];

        // إنشاء أو تحديث كل صلاحية مع guard_name
        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(
                    ['name' => "$action $module", 'guard_name' => 'api']
                );
            }
        }

        // ربط الصلاحيات بالأدوار
        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'api']);
        $admin->syncPermissions(Permission::all());

        $moderator = Role::firstOrCreate(['name' => 'Moderator', 'guard_name' => 'api']);
        $moderator->syncPermissions([
            // إدارة الأقسام الرئيسية والفرعية للقراءة فقط
            'view legaladvices',
            'view litigation-against',
            'view litigation-from',
            'view contracts-local',
            'view contracts-international',
            'view investigations',
            // إدارة المستخدمين والأدوار للعرض فقط
            'view users',
            'view roles',
            'view permissions',
            'view profile',
        ]);

        $user = Role::firstOrCreate(['name' => 'User', 'guard_name' => 'api']);
        $user->syncPermissions([
            'view profile',
        ]);
    }
}
