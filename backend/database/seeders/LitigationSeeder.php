<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Litigation;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon; // Laravel aliases Carbon, this is fine.

class LitigationSeeder extends Seeder
{
    public function run(): void
    {
        // مناطق/مدن + أكواد للاستخدام في أرقام القضايا
        $regions = [
            ['code' => 'TRP', 'name' => 'طرابلس'],
            ['code' => 'BEN', 'name' => 'بنغازي'],
            ['code' => 'MSR', 'name' => 'مصراتة'],
            ['code' => 'SBH', 'name' => 'سبها'],
            ['code' => 'BRQ', 'name' => 'البيضاء'],
            ['code' => 'DRN', 'name' => 'درنة'],
            ['code' => 'ZWA', 'name' => 'الزاوية'],
            ['code' => 'GHT', 'name' => 'غريان'],
            ['code' => 'SRT', 'name' => 'سرت'],
            ['code' => 'AJD', 'name' => 'اجدابيا'],
        ];

        // محاكم ليبية شائعة
        $courts = [
            'محكمة طرابلس الابتدائية',
            'محكمة شمال طرابلس الابتدائية',
            'محكمة بنغازي الابتدائية',
            'محكمة مصراتة الابتدائية',
            'محكمة سبها الابتدائية',
            'محكمة البيضاء الابتدائية',
            'محكمة درنة الابتدائية',
            'محكمة الزاوية الابتدائية',
            'محكمة غريان الابتدائية',
            'محكمة سرت الابتدائية',
            'محكمة طرابلس التجارية',
            'محكمة بنغازي التجارية',
        ];

        // موضوعات القضايا
        $subjectsFrom = [
            'دعوى للمطالبة بقيمة مستحقات مالية مترتبة على عقد توريد',
            'دعوى فسخ عقد لعدم التنفيذ مع التعويض',
            'دعوى تسليم بضائع وفقًا لشروط العقد',
            'دعوى إنهاء عقد خدمات وسداد المديونية',
            'دعوى مطالبة بفوائد تأخيرية وتعويضات',
        ];

        $subjectsAgainst = [
            'دعوى تعويض عن إنهاء مفاجئ لعقد توريد',
            'دعوى مطالبة بمستحقات مقاولات متنازع عليها',
            'دعوى بطلان شرط جزائي مبالغ فيه',
            'دعوى رد مبالغ مدفوعة دون وجه حق',
            'دعوى إخلال بالضمانات الفنية للمعدات',
        ];

        // أسماء خصوم/شركات ليبية (عينة)
        $opponentsBiz = [
            'شركة المدار القابضة',
            'شركة ليبيانا للهاتف المحمول',
            'شركة البريقة لتسويق النفط',
            'الشركة العامة للكهرباء',
            'شركة الحديد والصلب',
            'مصرف الجمهورية',
            'مصرف الوحدة',
            'شركة الاتصالات الدولية الليبية',
            'شركة النهر الصناعي',
            'شركة الخدمات العامة',
        ];

        // ملاحظات عامة يتم تدويرها عشوائيًا
        $notesPool = [
            'تم إيداع صحيفة الدعوى واستلام رقم الأساس.',
            'القضية في طور المرافعة وتم تبادل المذكرات.',
            'تم إحالة الدعوى للخبرة الفنية.',
            'تمت محاولة تسوية ودية بين الطرفين.',
            'تم ضم الدعوى لأخرى مرتبطة بذات الموضوع.',
        ];

        // مولد رقم قضية شكله: TRP-FC-2023-0001
        $makeCaseNumber = function (string $code, string $type, int $year, int $seq): string {
            return sprintf('%s-%s-%d-%04d', $code, $type, $year, $seq);
        };

        // ✅ قضايا مرفوعة من الشركة (from)
        $seqFrom = 1;
        foreach (range(1, 12) as $i) {
            $region  = $regions[array_rand($regions)];
            $year    = rand(2016, (int)date('Y'));
            $court   = $courts[array_rand($courts)];
            $subject = $subjectsFrom[array_rand($subjectsFrom)];
            $opp     = $opponentsBiz[array_rand($opponentsBiz)] . ' - فرع ' . $region['name'];
            $status  = ['open', 'in_progress', 'closed'][rand(0, 2)];
            $filedAt = Carbon::now()->subDays(rand(30, 720))->format('Y-m-d');

            Litigation::create([
                'case_number' => $makeCaseNumber($region['code'], 'FC', $year, $seqFrom++),
                'case_year'   => $year,
                'court'       => $court,
                'scope'       => 'from',
                'opponent'    => $opp,
                'subject'     => $subject,
                'filing_date' => $filedAt,
                'status'      => $status,
                'notes'       => $notesPool[array_rand($notesPool)] . ' القائم على الدعوى: مكتب المحامي محمد.',
                'created_by'  => 1,
            ]);
        }

        // ✅ قضايا مرفوعة ضد الشركة (against)
        $seqAgainst = 1;
        foreach (range(1, 12) as $i) {
            $region  = $regions[array_rand($regions)];
            $year    = rand(2016, (int)date('Y'));
            $court   = $courts[array_rand($courts)];
            $subject = $subjectsAgainst[array_rand($subjectsAgainst)];
            $opp     = $opponentsBiz[array_rand($opponentsBiz)] . ' - إدارة ' . $region['name'];
            $status  = ['open', 'in_progress', 'closed'][rand(0, 2)];
            $filedAt = Carbon::now()->subDays(rand(45, 900))->format('Y-m-d');

            Litigation::create([
                'case_number' => $makeCaseNumber($region['code'], 'AC', $year, $seqAgainst++),
                'case_year'   => $year,
                'court'       => $court,
                'scope'       => 'against',
                'opponent'    => $opp,
                'subject'     => $subject,
                'filing_date' => $filedAt,
                'status'      => $status,
                'notes'       => $notesPool[array_rand($notesPool)] . ' أُرفقت مستندات إثبات من الخصم.',
                'created_by'  => 1,
            ]);
        }
    }
}
