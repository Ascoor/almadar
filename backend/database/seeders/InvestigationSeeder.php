<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Investigation;

class InvestigationSeeder extends Seeder
{
    public function run(): void
    {
        $sources = [
            'مكتب الموارد البشرية - طرابلس',
            'مكتب التفتيش والمتابعة - بنغازي',
            'الإدارة العامة للمشروعات - مصراتة',
            'مكتب الشؤون القانونية - سبها',
            'إدارة التشغيل والصيانة - سرت',
        ];

        $subjects = [
            'تأخير متكرر في مواقع العمل الميدانية',
            'سوء سلوك وظيفي أثناء التعامل مع الموردين المحليين',
            'خروج دون إذن من موقع مشروع طريق عام',
            'إفشاء وثائق تخص عقود طاقة متجددة',
            'تقصير في الأداء وتسبب في تأخر تسليم مشروع حكومي',
            'عدم الالتزام بإجراءات السلامة في حقل نفطي',
            'تجاوز الصلاحيات في توقيع أوامر شراء جنوب البلاد',
        ];

        foreach (range(1, 10) as $i) {
            Investigation::create([
                'employee_name' => 'موظف ' . $i . ' - فرع ' . ['طرابلس','بنغازي','مصراتة','سبها','الزاوية'][array_rand([0,1,2,3,4])],
                'source' => $sources[array_rand($sources)],
                'subject' => $subjects[array_rand($subjects)],
                'case_number' => 'INV-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'decision' => null,
                'status' => 'open',
                'created_by' => 1, // ✅ معرف المستخدم المنشئ
            ]);
        }
    }
}
