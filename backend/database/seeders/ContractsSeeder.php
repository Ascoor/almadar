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
            'شركة المدار الجديد','شركة ليبيانا للهاتف المحمول','الشركة الليبية للبريد والاتصالات وتقنية المعلومات',
            'شركة البريقة لتسويق النفط','شركة الزويتينة للنفط','شركة الخليج العربي للنفط',
            'شركة ليبيا للحديد والصلب','الشركة العامة للكهرباء','شركة النهر الصناعي',
            'شركة الخطوط الجوية الليبية','شركة الخطوط الأفريقية','الشركة الليبية للموانئ',
            'جهاز تطوير المراكز الإدارية','الشركة العامة للأشغال','شركة استثمارات طرابلس القابضة',
            'شركة مرافق بنغازي','شركة الواحات للخدمات النفطية','شركة فزان للنقل والخدمات',
            'شركة خدمات الجنوب اللوجستية','شركة ميناء مصراتة الحر',
        ];

        $regions = [
            'طرابلس', 'بنغازي', 'مصراتة', 'سبها', 'الزاوية', 'سرت', 'غريان', 'اجدابيا', 'درنة', 'البيضاء'
        ];

        for ($i = 1; $i <= self::TOTAL_CONTRACTS; $i++) {
            $scope = $i <= self::LOCAL_CONTRACTS ? 'local' : 'international';

            Contract::create([
                'contract_category_id' => $categories->random()->id,
                'scope'                => $scope, // لو العمود ENUM لازم يدعم 'local' و 'international'
                'number'               => strtoupper($scope[0]) . '-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'contract_parties'     => $this->generateContractParties($companies, $regions),
                'value'                => $scope === 'local'
                    ? random_int(50_000, 500_000)
                    : random_int(100_000, 1_000_000),
                'start_date'           => now()->subMonths(rand(1, 12)),
                'end_date'             => now()->addMonths(rand(6, 24)),
                'notes'                => ($scope === 'local' ? 'عقد محلي لجهة في ' : 'عقد دولي مرتبط بفرع في ') . $this->randomRegion($regions) . ' تجريبي رقم ' . $i,
                'attachment'           => null,
                'status'               => 'active', // لو ENUM لازم يدعم 'active'
                'summary'              => 'ملخص عقد ' . ($scope === 'local' ? 'محلي' : 'دولي') . ' رقم ' . $i . ' خاص بمشاريع ليبيا الحيوية مثل محطات الكهرباء والطرق.',
                'created_by'           => 1,
            ]);
        }
    }

    private function generateContractParties(array $companies, array $regions): string
    {
        $company1 = $companies[array_rand($companies)] . ' - ' . $this->randomRegion($regions);
        do {
            $company2 = $companies[array_rand($companies)] . ' - ' . $this->randomRegion($regions);
        } while ($company1 === $company2);

        return "$company1 × $company2";
    }

    private function randomRegion(array $regions): string
    {
        return $regions[array_rand($regions)];
    }
}
