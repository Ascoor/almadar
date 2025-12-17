<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            UsersTableSeeder::class,
            ContractCategoriesSeeder::class,
            ContractsSeeder::class,
            InvestigationSeeder::class,
            InvestigationActionSeeder::class,
            LegalAdviceSeeder::class,
            LitigationSeeder::class,
            LitigationActionsSeeder::class,
            LibyaLocationsSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}
