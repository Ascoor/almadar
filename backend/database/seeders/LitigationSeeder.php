<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Litigation;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class LitigationSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ قضايا مرفوعة من الشركة
        foreach (range(1, 5) as $i) {
            Litigation::create([
                'case_number' => 'FC-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'case_year' => rand(2010, 2023),
                'court'       => 'محكمة الرياض الابتدائية',
                'scope' => 'from',
                'opponent'    => 'شركة الابتكار التقني ' . $i,
                'subject'     => 'دعوى للمطالبة بقيمة مستحقات مالية مترتبة على عقد خدمات',
                'filing_date' => Carbon::now()->subDays(rand(60, 365))->format('Y-m-d'),
                'status'      => ['open', 'in_progress', 'closed'][rand(0, 2)],
                'notes'       => 'تم رفع الدعوى بناءً على إخطار قانوني رسمي. القائم على الدعوى: مكتب المحامي خالد.',
            ]);
        }

        // ✅ قضايا مرفوعة ضد الشركة
        foreach (range(6, 10) as $i) {
            Litigation::create([
                'case_number' => 'AC-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'case_year' => rand(2010, 2023),
                'court'       => 'محكمة جدة التجارية',
                'scope' => 'against ',
                'opponent'    => 'مؤسسة الإنشاءات الذكية ' . $i,
                'subject'     => 'دعوى تعويض عن إنهاء مفاجئ لعقد توريد بضائع',
                'filing_date' => Carbon::now()->subDays(rand(90, 500))->format('Y-m-d'),
                'status'      => ['open', 'in_progress', 'closed'][rand(0, 2)],
                'notes'       => 'الخصم طالب بتعويض مالي مرفق بمستندات إثبات. القضية في طور المرافعة.',
                  'created_by' => 1, // ✅ مضاف
            ]);
        }
    }
}
