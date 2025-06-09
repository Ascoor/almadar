<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class UsersRolesPermissionsSeeder extends Seeder
{
        public function run(): void
        {
            // إلغاء الكاش لضمان تحديث الصلاحيات
            app()[PermissionRegistrar::class]->forgetCachedPermissions();

            // 1. إنشاء كل الصلاحيات المطلوبة لجميع الأقسام
            $modules = [
                'archive'             => ['view', 'create', 'edit', 'delete'],
                'legaladvices'        => ['view', 'create', 'edit', 'delete'],
                'litigations'         => ['view', 'create', 'edit', 'delete'],
                'litigation-from'     => ['view', 'create', 'edit', 'delete'],
                'litigation-from-actions' => ['view', 'create', 'edit', 'delete'],
                'litigation-against'  => ['view', 'create', 'edit', 'delete'],
                'litigation-against-actions' => ['view', 'create', 'edit', 'delete'],
                'contracts'           => ['view', 'create', 'edit', 'delete'],
                'investigations'      => ['view', 'create', 'edit', 'delete'],
                'investigation-actions' => ['view', 'create', 'edit', 'delete'],
                'users'               => ['view', 'create', 'edit', 'delete'],  // صلاحيات إدارة المستخدمين
                'roles'               => ['view', 'create', 'edit', 'delete'],  // صلاحيات إدارة الأدوار
                'permissions'         => ['view', 'create', 'edit', 'delete'],  // صلاحيات إدارة الصلاحيات
                'managment-lists'     => ['view', 'create', 'edit', 'delete'],
                'reports'             => ['view', 'create', 'edit', 'delete'],
                'profile'             => ['view', 'edit'],
            ];

            // إنشاء كل الصلاحيات المطلوبة
            foreach ($modules as $module => $actions) {
                foreach ($actions as $action) {
                    Permission::firstOrCreate([
                        'name' => "$action $module",
                        'guard_name' => 'api',
                    ]);
                }
            }

            // 2. إنشاء الدور Admin
            $adminRole = Role::firstOrCreate([
                'name' => 'Admin',
                'guard_name' => 'api',
            ]);

            // 3. إعطاء جميع الصلاحيات للمسؤول الأول (محمد)
            $allPermissions = Permission::all();
            $mohamed = User::create([
                'name' => 'د. محمد',
                'email' => 'mohamed@almadar.ly',
                'password' => Hash::make('Askar@1984'),
                'password_changed' => true,
                'image' => 'users_images/admin1.png',
            ]);
            $mohamed->assignRole($adminRole);
            $mohamed->syncPermissions($allPermissions); // إعطاء جميع الصلاحيات بما في ذلك صلاحيات إدارة المستخدمين

            // 4. إنشاء باقي المسؤولين وتخصيص الصلاحيات
            $otherAdmins = [
                ['name' => 'أ. عدنان', 'email' => 'adnan@almadar.ly', 'image' => 'users_images/admin2.jpg'],
                ['name' => 'أ. سكينة', 'email' => 'sakeena@almadar.ly', 'image' => 'users_images/admin4.png'],
                ['name' => 'أدمن 4',   'email' => 'admin4@almadar.ly', 'image' => 'users_images/admin3.jpg'],
                ['name' => 'أدمن 5',   'email' => 'admin5@almadar.ly', 'image' => 'users_images/admin5.jpg'],
            ];

            foreach ($otherAdmins as $adminData) {
    $admin = User::create([
        'name' => $adminData['name'],
        'email' => $adminData['email'],
        'password' => Hash::make('Askar@1984'),
        'password_changed' => true,
        'image' => $adminData['image'],
    ]);

    $admin->assignRole($adminRole);

    // ✖️ استثناء صلاحيات المستخدمين والأدوار والصلاحيات من التفعيل
    $excluded = [
        'users', 'roles', 'permissions'
    ];

    $grantedPermissions = Permission::all()->filter(function ($perm) use ($excluded) {
        foreach ($excluded as $ex) {
            if (str_contains($perm->name, $ex)) return false;
        }
        return true;
    });

    // ✅ منح باقي الصلاحيات فقط
    $admin->syncPermissions($grantedPermissions);
}

        }
    }
