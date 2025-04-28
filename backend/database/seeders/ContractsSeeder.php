<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contract;
use App\Models\ContractCategory; 

class ContractsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ContractCategory::all();

        if ($categories->isEmpty()) {
            $this->command->warn('⚠️ لا توجد تصنيفات عقود، تأكد من تشغيل ContractCategoriesSeeder أولاً.');
            return;
        }

        // إنشاء 5 عقود محلية
        for ($i = 1; $i <= 5; $i++) {
            Contract::create([
                'contract_category_id' => $categories->random()->id,
                'scope' => 'local',
                'number' => 'LOC-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'value' => random_int(50000, 500000),
                'start_date' => now()->subMonths(rand(1, 12)),
                'end_date' => now()->addMonths(rand(6, 24)),
                'notes' => 'عقد محلي تجريبي رقم ' . $i,
                'attachment' => null,
                'status' => 'active',
                'summary' => 'ملخص عقد محلي رقم ' . $i . '. تم إنشاؤه لأغراض اختبار النظام.',
            ]);
        }

        // إنشاء 5 عقود دولية
        for ($i = 1; $i <= 5; $i++) {
            Contract::create([
                'contract_category_id' => $categories->random()->id,
                'scope' => 'international',
                'number' => 'INT-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'value' => random_int(100000, 1000000),
                'start_date' => now()->subMonths(rand(1, 12)),
                'end_date' => now()->addMonths(rand(6, 24)),
                'notes' => 'عقد دولي تجريبي رقم ' . $i,
                'attachment' => null,
                'status' => 'active',
                'summary' => 'ملخص عقد دولي رقم ' . $i . '. تم إنشاؤه لأغراض اختبار النظام.',
            ]);
        }
    }
}
