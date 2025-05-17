<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // تأكد أن الأدوار موجودة مع guard_name الصحيح
        $adminRole = Role::firstOrCreate([
            'name' => 'Admin',
            'guard_name' => 'api',   // مهم جداً
        ]);

        $moderatorRole = Role::firstOrCreate([
            'name' => 'Moderator',
            'guard_name' => 'api',   // مهم جداً
        ]);

        $userRole = Role::firstOrCreate([
            'name' => 'User',
            'guard_name' => 'api',   // مهم جداً
        ]);

        // إنشاء مستخدم أدمن
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('Ask@123456'),
    'image' => 'users_images/admin.png',
        ]);
        $admin->assignRole($adminRole);

        // إنشاء مشرف
        $moderator = User::create([
            'name' => 'Site Moderator',
            'email' => 'user2@example.com',
            'password' => Hash::make('Ask@123456'),
    'image' => 'users_images/moderator.png',
    ]);
    $moderator->assignRole($moderatorRole);

    // إنشاء مستخدم عادي بصورة افتراضية
    $user = User::factory()->create([
        'name' => 'Normal User',
        'email' => 'user3@example.com',
        'password' => Hash::make('Ask@123456'),
        'image' => 'users_images/user.png',
    ]);
    $user->assignRole($userRole);
    }
    
}
