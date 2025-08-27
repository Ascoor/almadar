<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\Contract;
use App\Models\ContractCategory;

class ContractsSeeder extends Seeder
{
    const TOTAL_CONTRACTS = 40;
    const LOCAL_CONTRACTS = 20;
    const INTERNATIONAL_CONTRACTS = 20;

    public function run(): void
    {
        // 🧹 reset للجدول قبل السييد (بدون لمس التصنيفات)
        Schema::disableForeignKeyConstraints();
        DB::table('contracts')->truncate();
        Schema::enableForeignKeyConstraints();

        $categories = ContractCategory::all();
        if ($categories->isEmpty()) {
            $this->command->warn('⚠️ لا توجد تصنيفات عقود، تأكد من تشغيل ContractCategoriesSeeder أولاً.');
            return;
        }

        $companies = [
            'شركة المستقبل','شركة الإبداع','شركة التقنيات المتقدمة',
            'شركة الريادة','شركة الازدهار','شركة النخبة',
            'شركة الحلول الذكية','شركة الرؤية','شركة التطوير الشامل',
            'شركة الفجر الجديد','شركة النور الساطع','شركة الزهراء',
            'شركة الأفق الجديد','شركة النجاح المتجدد','شركة المحيط',
            'شركة الخليج للأعمال','شركة الفجر الزاهر','شركة سماء المستقبل',
            'شركة الإتقان','شركة العالم المتطور',
        ];

        for ($i = 1; $i <= self::TOTAL_CONTRACTS; $i++) {
            $scope = $i <= self::LOCAL_CONTRACTS ? 'local' : 'international';

            Contract::create([
                'contract_category_id' => $categories->random()->id,
                'scope'                => $scope, // لو العمود ENUM لازم يدعم 'local' و 'international'
                'number'               => strtoupper($scope[0]) . '-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'contract_parties'     => $this->generateContractParties($companies),
                'value'                => $scope === 'local'
                    ? random_int(50_000, 500_000)
                    : random_int(100_000, 1_000_000),
                'start_date'           => now()->subMonths(rand(1, 12)),
                'end_date'             => now()->addMonths(rand(6, 24)),
                'notes'                => ($scope === 'local' ? 'عقد محلي' : 'عقد دولي') . ' تجريبي رقم ' . $i,
                'attachment'           => null,
                'status'               => 'active', // لو ENUM لازم يدعم 'active'
                'summary'              => ($scope === 'local' ? 'ملخص عقد محلي' : 'ملخص عقد دولي') . ' رقم ' . $i . '. تم إنشاؤه لأغراض اختبار النظام.',
                'created_by'           => 1,
            ]);
        }
    }

    private function generateContractParties(array $companies): string
    {
        $company1 = $companies[array_rand($companies)];
        do {
            $company2 = $companies[array_rand($companies)];
        } while ($company1 === $company2);

        return "$company1 × $company2";
    }
}
