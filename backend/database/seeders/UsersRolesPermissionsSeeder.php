<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class UsersRolesPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // نفس الجارد المستخدم في API
        $guard = 'api';

        // امسح كاش الصلاحيات
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // 🧹 تعطيل الـ FK ثم تفريغ الجداول المتعلقة بالأذونات/الأدوار/المستخدمين
        Schema::disableForeignKeyConstraints();
        DB::table('model_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('role_has_permissions')->truncate();
        DB::table('permissions')->truncate();
        DB::table('roles')->truncate();
        DB::table('users')->truncate();
        Schema::enableForeignKeyConstraints();

        // 1) إنشاء كل الصلاحيات المطلوبة
        $modules = [
            'archive'                 => ['view','create','edit','delete'],
            'legaladvices'            => ['view','create','edit','delete'],
            'litigations'             => ['view','create','edit','delete'],
            'litigation-from'         => ['view','create','edit','delete'],
            'litigation-from-actions' => ['view','create','edit','delete'],
            'litigation-against'      => ['view','create','edit','delete'],
            'litigation-against-actions'=> ['view','create','edit','delete'],
            'contracts'               => ['view','create','edit','delete'],
            'investigations'          => ['view','create','edit','delete'],
            'investigation-actions'   => ['view','create','edit','delete'],
            'users'                   => ['view','create','edit','delete'],
            'roles'                   => ['view','create','edit','delete'],
            'permissions'             => ['view','create','edit','delete'],
            'managment-lists'         => ['view','create','edit','delete'],
            'reports'                 => ['view','create','edit','delete'],
            'profile'                 => ['view','edit'],
        ];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name'       => "$action $module",
                    'guard_name' => $guard,
                ]);
            }
        }

        // 2) الأدوار
        $adminRole   = Role::firstOrCreate(['name' => 'Admin',   'guard_name' => $guard]);
        $managerRole = Role::firstOrCreate(['name' => 'Manager', 'guard_name' => $guard]);
        $userRole    = Role::firstOrCreate(['name' => 'User',    'guard_name' => $guard]);

        // 3) تجميع الصلاحيات
        $allPermissions = Permission::all();

        $managerPermissions = Permission::whereIn('name', [
            'view archive','view legaladvices','view litigations',
            'view contracts','view investigations','view reports',
            'view profile','edit profile',
        ])->get();

        $userPermissions = Permission::whereIn('name', [
            'view legaladvices','view contracts','view profile','edit profile',
        ])->get();

        // 4) Admin users
        $adminUsers = [
            ['name'=>'د. محمد','email'=>'mohamed@almadar.ly','image'=>'users_images/admin1.png'],
            ['name'=>'أ. عدنان','email'=>'adnan@almadar.ly','image'=>'users_images/admin2.jpg'],
            ['name'=>'أ. سكينة','email'=>'sakeena@almadar.ly','image'=>'users_images/admin4.png'],
            ['name'=>'أدمن 4','email'=>'admin4@almadar.ly','image'=>'users_images/admin3.jpg'],
            ['name'=>'أدمن 5','email'=>'admin5@almadar.ly','image'=>'users_images/admin5.jpg'],
        ];

        foreach ($adminUsers as $adminData) {
            $admin = User::create([
                'name'             => $adminData['name'],
                'email'            => $adminData['email'],
                'password'         => Hash::make('Askar@1984'),
                'password_changed' => true,
                'image'            => $adminData['image'],
            ]);
            $admin->assignRole($adminRole);
            $admin->syncPermissions($allPermissions);
        }

        // 5) Managers
        $additionalManagers = [
            ['name'=>'Manager User 1','email'=>'manager1@almadar.ly'],
            ['name'=>'Manager User 2','email'=>'manager2@almadar.ly'],
        ];
        foreach ($additionalManagers as $managerData) {
            $manager = User::create([
                'name'             => $managerData['name'],
                'email'            => $managerData['email'],
                'password'         => Hash::make('Manager123!'),
                'password_changed' => true,
            ]);
            $manager->assignRole($managerRole);
            $manager->syncPermissions($managerPermissions);
        }

        // 6) Users
        $additionalUsers = [
            ['name'=>'User 1','email'=>'user1@almadar.ly'],
            ['name'=>'User 2','email'=>'user2@almadar.ly'],
        ];
        foreach ($additionalUsers as $userData) {
            $user = User::create([
                'name'             => $userData['name'],
                'email'            => $userData['email'],
                'password'         => Hash::make('User123!'),
                'password_changed' => true,
            ]);
            $user->assignRole($userRole);
            $user->syncPermissions($userPermissions);
        }

        // فلَش الكاش بعد الربط
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
