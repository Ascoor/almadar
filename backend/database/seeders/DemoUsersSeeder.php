<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUsersSeeder extends Seeder
{
    protected array $users = [
        // managers
        ['name' => 'خالد بن يوسف', 'email' => 'manager1@almadar.ly', 'role' => 'manager'],
        ['name' => 'سالم المبروك', 'email' => 'manager2@almadar.ly', 'role' => 'manager'],
        ['name' => 'عبدالله الترهوني', 'email' => 'manager3@almadar.ly', 'role' => 'manager'],
        ['name' => 'ناصر القذافي', 'email' => 'manager4@almadar.ly', 'role' => 'manager'],
        ['name' => 'يوسف الدرسي', 'email' => 'manager5@almadar.ly', 'role' => 'manager'],

        // lawyers
        ['name' => 'فتحي العوامي', 'email' => 'lawyer1@almadar.ly', 'role' => 'lawyer'],
        ['name' => 'جمال الصغير', 'email' => 'lawyer2@almadar.ly', 'role' => 'lawyer'],
        ['name' => 'محمود القويري', 'email' => 'lawyer3@almadar.ly', 'role' => 'lawyer'],
        ['name' => 'أسامة الجبالي', 'email' => 'lawyer4@almadar.ly', 'role' => 'lawyer'],
        ['name' => 'طارق المنتصر', 'email' => 'lawyer5@almadar.ly', 'role' => 'lawyer'],

        // investigators
        ['name' => 'عادل الشريف', 'email' => 'investigator1@almadar.ly', 'role' => 'legal_investigator'],
        ['name' => 'مفتاح بوعجيلة', 'email' => 'investigator2@almadar.ly', 'role' => 'legal_investigator'],
        ['name' => 'فرج البرعصي', 'email' => 'investigator3@almadar.ly', 'role' => 'legal_investigator'],
        ['name' => 'مصطفى بوشعالة', 'email' => 'investigator4@almadar.ly', 'role' => 'legal_investigator'],
        ['name' => 'حاتم العرفي', 'email' => 'investigator5@almadar.ly', 'role' => 'legal_investigator'],

        // users
        ['name' => 'محمد الفيتوري', 'email' => 'user1@almadar.ly', 'role' => 'user'],
        ['name' => 'إبراهيم الزنتاني', 'email' => 'user2@almadar.ly', 'role' => 'user'],
        ['name' => 'أيمن بن حليم', 'email' => 'user3@almadar.ly', 'role' => 'user'],
        ['name' => 'طارق المصراتي', 'email' => 'user4@almadar.ly', 'role' => 'user'],
        ['name' => 'أنس بوعلاق', 'email' => 'user5@almadar.ly', 'role' => 'user'],
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
