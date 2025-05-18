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
        // 1. تفريغ كاش الصلاحيات لتجنب تعارضات
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. تعريف الوحدات (الأقسام) مع الإجراءات (الصلاحيات) الخاصة بها
        $modules = [
            'legaladvices'             => ['view', 'create', 'edit', 'delete'],
            'litigations'       => ['view', 'create', 'edit', 'delete'], 
            'contracts'               => ['view', 'create', 'edit', 'delete'],
            'investigations'           => ['view', 'create', 'edit', 'delete'],
            'users'                    => ['view', 'create', 'edit', 'delete'],
            'roles'                    => ['view', 'create', 'edit', 'delete'],
            'permissions'              => ['view', 'create', 'edit', 'delete'],
            'profile'                  => ['view', 'edit'],
        ];

        // 3. إنشاء الصلاحيات لكل وحدة مع اسم الحارس (guard_name)
        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$action} {$module}",
                    'guard_name' => 'api', // تأكد أن الحارس هنا يتطابق مع الحارس المستخدم في التطبيق (api أو web)
                ]);
            }
        }

        // 4. إنشاء الأدوار وربطها بالصلاحيات بطريقة واضحة ومنظمة
        // دور المدير العام (Admin) يحصل على جميع الصلاحيات
        $adminRole = Role::firstOrCreate([
            'name' => 'Admin',
            'guard_name' => 'api',
        ]);
        $adminRole->syncPermissions(Permission::all());

        // دور المشرف (Moderator) مع صلاحيات قراءة وتعديل محدودة
        $moderatorRole = Role::firstOrCreate([
            'name' => 'Moderator',
            'guard_name' => 'api',
        ]);

        // تحديد فقط صلاحيات العرض والتعديل التي يحتاجها المشرف
        $moderatorPermissions = [];

        // مثلاً: المشرف يمكنه فقط عرض معظم الأقسام وتعديل ملفه الشخصي
        foreach ($modules as $module => $actions) {
            if ($module === 'profile') {
                $moderatorPermissions[] = 'view profile';
                $moderatorPermissions[] = 'edit profile';
            } else {
                $moderatorPermissions[] = "view {$module}";
            }
        }

        $moderatorRole->syncPermissions($moderatorPermissions);

        // دور المستخدم العادي (User) مع صلاحيات محدودة جداً
        $userRole = Role::firstOrCreate([
            'name' => 'User',
            'guard_name' => 'api',
        ]);

        // المستخدم العادي يمكنه فقط عرض وتعديل ملفه الشخصي
        $userRole->syncPermissions([
            'view profile',
            'edit profile',
        ]);
    }
}
