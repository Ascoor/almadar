<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // التأكد من وجود دور Admin
        $adminRole = Role::firstOrCreate([
            'name' => 'Admin',
            'guard_name' => 'api',  // تأكد أن الحارس يتطابق مع ما تستخدمه في تطبيقك
        ]);

        // التأكد من وجود دور Moderator (اختياري)
        $moderatorRole = Role::firstOrCreate([
            'name' => 'Moderator',
            'guard_name' => 'api',
        ]);

        // التأكد من وجود دور User
        $userRole = Role::firstOrCreate([
            'name' => 'User',
            'guard_name' => 'api',
        ]);

        // إنشاء المستخدمين وتعيين الأدوار لهم
        // إنشاء مستخدم Admin
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('Ask@123456'),
            'image' => 'users_images/admin.png',
        ]);
        // تعيين صلاحيات Admin (جميع الصلاحيات)
        $admin->assignRole($adminRole);
        $admin->syncPermissions(Permission::all()); // منح جميع الصلاحيات لـ Admin

        // إنشاء مستخدم Moderator
        $moderator = User::create([
            'name' => 'Site Moderator',
            'email' => 'moderator@example.com',
            'password' => Hash::make('Ask@123456'),
            'image' => 'users_images/moderator.png',
        ]);
        // تعيين صلاحيات Moderator (صلاحيات محدودة)
        $moderator->assignRole($moderatorRole);

        // إنشاء مستخدم عادي
        $user = User::create([
            'name' => 'Normal User',
            'email' => 'user@example.com',
            'password' => Hash::make('Ask@123456'),
            'image' => 'users_images/user.png',
        ]);
        // تعيين صلاحيات User (صلاحيات محدودة مثل عرض وتعديل الملف الشخصي)
        $user->assignRole($userRole);
    }
}
