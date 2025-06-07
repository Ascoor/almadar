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

        // 1. إنشاء كل الصلاحيات المطلوبة
        $modules = [
            'archive'             => ['view', 'create', 'edit', 'delete'],
            'legaladvices'             => ['view', 'create', 'edit', 'delete'],
            'litigations'              => ['view', 'create', 'edit', 'delete'],
            'litigation-from'          => ['view', 'create', 'edit', 'delete'],
            'litigation-from-actions'  => ['view', 'create', 'edit', 'delete'],
            'litigation-against'       => ['view', 'create', 'edit', 'delete'],
            'litigation-against-actions' => ['view', 'create', 'edit', 'delete'],
            'contracts'                => ['view', 'create', 'edit', 'delete'],
            'investigations'           => ['view', 'create', 'edit', 'delete'],
            'investigation-actions'    => ['view', 'create', 'edit', 'delete'],
            'users'                    => ['view', 'create', 'edit', 'delete'],
            'roles'                    => ['view', 'create', 'edit', 'delete'],
            'permissions'              => ['view', 'create', 'edit', 'delete'],
            'managment-lists'          => ['view', 'create', 'edit', 'delete'],
            'reports'                  => ['view', 'create', 'edit', 'delete'],
            'profile'                  => ['view', 'edit'],
        ];

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

        // 3. تحديد صلاحيات إدارة المستخدمين (لـ محمد فقط)
        $userManagementPermissions = Permission::whereIn('name', [
            'view users', 'create users', 'edit users', 'delete users',
            'view roles', 'create roles', 'edit roles', 'delete roles',
            'view permissions', 'create permissions', 'edit permissions', 'delete permissions',
        ])->pluck('id')->toArray();

        $allPermissions = Permission::all();
        $otherPermissions = $allPermissions->whereNotIn('id', $userManagementPermissions);

        // 4. إنشاء المستخدم الرئيسي (محمد) مع كل الصلاحيات
        $mohamed = User::create([
            'name' => 'د. محمد',
            'email' => 'mohamed@almadar.ly',
            'password' => Hash::make('Askar@1984'),
            'password_changed' => true,
            'image' => 'users_images/admin1.png',
        ]);
        $mohamed->assignRole($adminRole);
        $mohamed->syncPermissions($allPermissions);

        // 5. إنشاء باقي المستخدمين بدون صلاحيات إدارة المستخدمين
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
            $admin->syncPermissions($otherPermissions);
        }
    }
}
