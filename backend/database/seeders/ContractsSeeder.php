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

        // بيانات أسماء شركات عربية وهمية
        $companies = [
            'شركة المستقبل',
            'شركة الإبداع',
            'شركة التقنيات المتقدمة',
            'شركة الريادة',
            'شركة الازدهار',
            'شركة النخبة',
            'شركة الحلول الذكية',
            'شركة الرؤية',
            'شركة التطوير الشامل',
            'شركة الفجر الجديد',
            'شركة النور الساطع',
            'شركة الزهراء',
            'شركة الأفق الجديد',
            'شركة النجاح المتجدد',
            'شركة المحيط',
            'شركة الخليج للأعمال',
            'شركة الفجر الزاهر',
            'شركة سماء المستقبل',
            'شركة الإتقان',
            'شركة العالم المتطور'
        ];

        // إنشاء 25 عقد محلي
        for ($i = 1; $i <= 25; $i++) {
            Contract::create([
                'contract_category_id' => $categories->random()->id,
                'scope' => 'local',
                'number' => 'LOC-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'contract_parties' => $this->generateContractParties($companies),
                'value' => random_int(50000, 500000),
                'start_date' => now()->subMonths(rand(1, 12)),
                'end_date' => now()->addMonths(rand(6, 24)),
                'notes' => 'عقد محلي تجريبي رقم ' . $i,
                'attachment' => null,
                'status' => 'active',
                'summary' => 'ملخص عقد محلي رقم ' . $i . '. تم إنشاؤه لأغراض اختبار النظام.',
            ]);
        }

        // إنشاء 25 عقد دولي
        for ($i = 26; $i <= 50; $i++) {
            Contract::create([
                'contract_category_id' => $categories->random()->id,
                'scope' => 'international',
                'number' => 'INT-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'contract_parties' => $this->generateContractParties($companies),
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

    /**
     * توليد أطراف عقد عشوائيين من الشركات.
     */
    private function generateContractParties(array $companies): string
    {
        $company1 = $companies[array_rand($companies)];
        do {
            $company2 = $companies[array_rand($companies)];
        } while ($company1 === $company2);

        return "$company1 × $company2";
    }
}
