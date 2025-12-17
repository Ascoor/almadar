<?php

namespace Database\Seeders;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('name', 'admin')->first();

        $admin = User::updateOrCreate(
            ['email' => 'admin@almadar.ly'],
            [
                'name' => 'مسؤول النظام',
                'phone' => '+218910000000',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'Admin@123456')),
                'password_changed' => true,
                'status' => UserStatus::Active->value,
            ]
        );

        if ($role) {
            $admin->syncRoles([$role->name]);
        }
    }
}
