<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUsersSeeder extends Seeder
{
    protected array $users = [
        [
            'name' => 'Aisha Admin',
            'email' => 'admin@example.test',
            'role' => 'admin',
            'gender' => 'female',
        ],
        [
            'name' => 'Omar Manager',
            'email' => 'manager@example.test',
            'role' => 'manager',
        ],
        [
            'name' => 'Fatima Lawyer',
            'email' => 'lawyer@example.test',
            'role' => 'lawyer',
            'gender' => 'female',
        ],
        [
            'name' => 'Karim Investigator',
            'email' => 'investigator@example.test',
            'role' => 'legal_investigator',
        ],
        [
            'name' => 'Sara Employee',
            'email' => 'employee@example.test',
            'role' => 'user',
            'gender' => 'female',
        ],
    ];

    public function run(): void
    {
        foreach ($this->users as $demoUser) {
            $user = User::updateOrCreate(
                ['email' => $demoUser['email']],
                [
                    'name' => $demoUser['name'],
                    'password' => Hash::make('password'),
                ]
            );

            $user->syncRoles([$demoUser['role']]);
        }
    }
}
