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
        // امسح كاش الصلاحيات مرة واحدة فقط
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // 1) تعريف الوحدات والأكشنات بنمطك "action module"
        $modules = [
            'archive'                    => ['view', 'create', 'edit', 'delete'],
            'legaladvices'               => ['view', 'create', 'edit', 'delete'],
            'litigations'                => ['view', 'create', 'edit', 'delete'],
            'litigation-from'            => ['view', 'create', 'edit', 'delete'],
            'litigation-from-actions'    => ['view', 'create', 'edit', 'delete'],
            'litigation-against'         => ['view', 'create', 'edit', 'delete'],
            'litigation-against-actions' => ['view', 'create', 'edit', 'delete'],
            'contracts'                  => ['view', 'create', 'edit', 'delete'],
            'investigations'             => ['view', 'create', 'edit', 'delete'],
            'investigation-actions'      => ['view', 'create', 'edit', 'delete'],
            'users'                      => ['view', 'create', 'edit', 'delete'],
            'roles'                      => ['view', 'create', 'edit', 'delete'],
            'permissions'                => ['view', 'create', 'edit', 'delete'],
            'managment-lists'            => ['view', 'create', 'edit', 'delete'],
            'reports'                    => ['view', 'create', 'edit', 'delete'],
            'profile'                    => ['view', 'edit'],
        ];

        // 2) إنشاء الصلاحيات
        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name'       => "{$action} {$module}", // يطابق نمطك
                    'guard_name' => 'api',
                ]);
            }
        }

        // 2.1) صلاحيات إدارية عامة لحماية الـ endpoints الإدارية
        Permission::firstOrCreate(['name' => 'manage permissions', 'guard_name' => 'api']);
        Permission::firstOrCreate(['name' => 'manage roles',       'guard_name' => 'api']);
        Permission::firstOrCreate(['name' => 'manage users',       'guard_name' => 'api']);

        // 3) الأدوار
        $adminRole   = Role::firstOrCreate(['name' => 'Admin',   'guard_name' => 'api']);
        $managerRole = Role::firstOrCreate(['name' => 'Manager', 'guard_name' => 'api']);
        $userRole    = Role::firstOrCreate(['name' => 'User',    'guard_name' => 'api']);

        $allPermissions     = Permission::all();

        $managerPermissions = Permission::whereIn('name', [
            'view archive', 'view legaladvices', 'view litigations',
            'view contracts', 'view investigations', 'view reports',
            'view profile', 'edit profile'
        ])->get();

        $userPermissions = Permission::whereIn('name', [
            'view legaladvices', 'view contracts', 'view profile', 'edit profile'
        ])->get();

        // 4) المستخدمون الإداريون
        $adminUsers = [
            ['name' => 'د. محمد',  'email' => 'mohamed@almadar.ly', 'image' => 'users_images/admin1.png'],
            ['name' => 'أ. عدنان', 'email' => 'adnan@almadar.ly',   'image' => 'users_images/admin2.jpg'],
            ['name' => 'أ. سكينة', 'email' => 'sakeena@almadar.ly', 'image' => 'users_images/admin4.png'],
            ['name' => 'أدمن 4',   'email' => 'admin4@almadar.ly',  'image' => 'users_images/admin3.jpg'],
            ['name' => 'أدمن 5',   'email' => 'admin5@almadar.ly',  'image' => 'users_images/admin5.jpg'],
        ];

        foreach ($adminUsers as $adminData) {
            $admin = User::firstOrCreate(
                ['email' => $adminData['email']],
                [
                    'name'              => $adminData['name'],
                    'password'          => Hash::make('Askar@1984'),
                    'password_changed'  => true,
                    'image'             => $adminData['image'] ?? null,
                ]
            );
            $admin->assignRole($adminRole);
            $admin->syncPermissions($allPermissions->pluck('name')->toArray());

            // أعطه أيضًا صلاحيات الإدارة العامة (لو مش ضمن all)
            $admin->givePermissionTo(['manage permissions', 'manage roles', 'manage users']);
        }

        // 5) المدراء
        $additionalManagers = [
            ['name' => 'Manager User 1', 'email' => 'manager1@almadar.ly'],
            ['name' => 'Manager User 2', 'email' => 'manager2@almadar.ly'],
        ];

        foreach ($additionalManagers as $managerData) {
            $manager = User::firstOrCreate(
                ['email' => $managerData['email']],
                [
                    'name'             => $managerData['name'],
                    'password'         => Hash::make('Manager123!'),
                    'password_changed' => true,
                ]
            );
            $manager->assignRole($managerRole);
            $manager->syncPermissions($managerPermissions->pluck('name')->toArray());
        }

        // 6) المستخدمون العاديون
        $additionalUsers = [
            ['name' => 'User 1', 'email' => 'user1@almadar.ly'],
            ['name' => 'User 2', 'email' => 'user2@almadar.ly'],
        ];

        foreach ($additionalUsers as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name'             => $userData['name'],
                    'password'         => Hash::make('User123!'),
                    'password_changed' => true,
                ]
            );
            $user->assignRole($userRole);
            $user->syncPermissions($userPermissions->pluck('name')->toArray());
        }
    }
}
