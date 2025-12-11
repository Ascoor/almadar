<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LegalAdvice;
use App\Models\AdviceType;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;

class LegalAdviceSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ أنواع الآراء القانونية (ليبيا) — بدون تكرار
        $types = [
            'قرار',
            'إرساء قانوني',
            'فتوى',
            'تعديل قانوني',
            'مذكرة تفسيرية',
        ];

        foreach ($types as $type) {
            AdviceType::firstOrCreate(['type_name' => $type]);
        }

        // ✅ أقسام/جهات طالبة ومُصدِرة
        $requesters = [
            'إدارة المشتريات',
            'إدارة الموارد البشرية',
            'الإدارة المالية',
            'إدارة العقود',
            'مكتب الشؤون القانونية',
            'إدارة التشغيل بالشركة العامة للكهرباء',
            'إدارة الاستكشاف بالمؤسسة الوطنية للنفط',
            'جهاز تنفيذ مشروعات الإسكان والمرافق',
        ];

        $issuers = [
            'الإدارة القانونية',
            'مكتب المستشار القانوني',
            'إدارة التشريع',
            'إدارة الشؤون القانونية بالمؤسسة الوطنية للنفط',
        ];

        // ✅ بادئات حسب الجهة لمزيد من الدلالة في رقم الفتوى
        $prefixByDept = [
            'إدارة المشتريات'      => 'PRC',
            'إدارة الموارد البشرية'  => 'HR',
            'الإدارة المالية'       => 'FIN',
            'إدارة العقود'          => 'CNT',
            'مكتب الشؤون القانونية' => 'LEG',
        ];

        // ✅ أكواد مناطق/مدن (لاستخدامها في رقم الفتوى)
        $regionCodes = ['TRP', 'BEN', 'MSR', 'SBH', 'BRQ', 'DRN', 'ZWA', 'GHT', 'SRT', 'AJD'];

        // ✅ دوال مساعدة
        $makeAdviceNumber = function (string $region, string $deptPrefix, int $year, int $seq): string {
            return sprintf('%s-LA-%s-%d-%04d', $region, $deptPrefix, $year, $seq);
        };

        $randomDate = function (): string {
            // تاريخ خلال آخر 18 شهر
            return Carbon::now()->subDays(rand(5, 540))->format('Y-m-d');
        };

        // ✅ مواضيع ونصوص بنكهة ليبية واقعية
        $topics = [
            'تجديد عقد توريد قطع غيار لشبكات الكهرباء',
            'صرف بدل مخاطر لمواقع العمل في الجنوب الليبي',
            'إنهاء عقد عمل وفق اللائحة الداخلية وقانون العمل الليبي',
            'طرح مناقصة عامة لصيانة خطوط نقل النفط',
            'تعديل بنود اتفاقية خدمات استشارية مع مكتب محلي',
            'ترسية مناقصة توريد معدات طاقة شمسية',
            'تفسير مادة تعاقدية متعلقة بالجزاءات في عقود الإنشاء',
            'تسوية ودية لمطالبة مالية مع مقاول محلي',
            'اعتماد نموذج تفويض التوقيع بمواقع الشركة في الشرق',
            'إجراءات تمديد مدة التنفيذ لمشروع إسكان حكومي',
            'إحالة دعوى تحكيم دولي مرتبطة بعقد بحري في ميناء مصراتة',
            'مراجعة شروط نقل ملكية معدات من فرع بنغازي لطرابلس',
        ];

        $texts = [
            'بعد المراجعة، يجوز التجديد بذات الشروط مع إضافة بند جزائي على التأخير وفق لوائح الشركة العامة للكهرباء.',
            'يُستحق البدل للحالات المبيّنة باللائحة شريطة توافر محاضر تكليف رسمية من الفروع الميدانية.',
            'يلزم إخطار الموظف كتابيًا قبل 30 يومًا وفق قانون العمل الليبي واللائحة الداخلية.',
            'يلزم الالتزام بقانون المشتريات رقم (12) لسنة 2010 ولائحته التنفيذية وإعلان المنافسة.',
            'يُوصى بتعديل البند الرابع بما يحقق مصلحة العمل دون الإخلال بحقوق الطرفين مع مراعاة قانون المعاملات المدنية.',
            'تُعتمد الترسية على أقل سعر مستوفٍ للشروط الفنية بعد توصية لجنة العطاءات ومراجعة التفويضات.',
            'تُفسَّر المادة محل الخلاف لصالح النص الواضح وتُرفض التأويلات غير المبررة استنادًا لقرارات المحكمة العليا الليبية.',
            'يُقترح عرض التسوية على اللجنة المختصة واعتماد محضر اتفاق نهائي بحضور ممثل الشؤون القانونية.',
            'يُعتمد التفويض وفق النموذج الموحّد بعد إرفاق سندات الصلاحية المطلوبة وتعميمها على فروع الشرق والجنوب.',
            'يجوز التمديد مرة واحدة بحد أقصى ربع المدة الأصلية مع عدم تحميل كلفة إضافية إلا بموافقة المانح.',
            'ينبغي إحالة ملف التحكيم لإدارة المنازعات الدولية ومراعاة قواعد غرفة التجارة الدولية.',
            'يُنصح بإبرام ملحق عقد يوضح إجراءات تسليم المعدات ونقل المسؤولية القانونية بين الفروع.',
        ];

        // ✅ إنشاء بعض عناصر ثابتة (إن أردت الحفاظ على أمثلة بعينها)
        $fixed = [
            [
                'topic'        => 'تجديد عقد توريد',
                'text'         => 'بعد المراجعة، يجوز تجديد العقد وفقًا للشروط السابقة.',
                'requester'    => 'إدارة المشتريات',
                'issuer'       => 'الإدارة القانونية',
                'advice_date'  => '2024-01-15',
                'advice_number'=> 'TRP-LA-PRC-2024-0001',
                'attachment'   => null,
                'type_name'    => 'قرار',
            ],
            [
                'topic'        => 'بدل المخاطر',
                'text'         => 'يُستحق البدل فقط في الحالات المعتمدة بلائحة المخاطر.',
                'requester'    => 'إدارة الموارد البشرية',
                'issuer'       => 'الإدارة القانونية',
                'advice_date'  => '2024-02-03',
                'advice_number'=> 'TRP-LA-HR-2024-0002',
                'attachment'   => null,
                'type_name'    => 'فتوى',
            ],
            [
                'topic'        => 'إنهاء عقد عمل',
                'text'         => 'يجب إخطار الموظف رسميًا قبل 30 يومًا من إنهاء التعاقد.',
                'requester'    => 'إدارة الموارد البشرية',
                'issuer'       => 'الإدارة القانونية',
                'advice_date'  => '2024-03-10',
                'advice_number'=> 'BEN-LA-HR-2024-0003',
                'attachment'   => null,
                'type_name'    => 'مذكرة تفسيرية',
            ],
            [
                'topic'        => 'مناقصة جديدة',
                'text'         => 'يجب الالتزام بقانون المشتريات الحكومية رقم 12 لسنة 2022.',
                'requester'    => 'الإدارة المالية',
                'issuer'       => 'الإدارة القانونية',
                'advice_date'  => '2024-04-01',
                'advice_number'=> 'MSR-LA-FIN-2024-0017',
                'attachment'   => null,
                'type_name'    => 'إرساء قانوني',
            ],
        ];

        foreach ($fixed as $row) {
            $type = AdviceType::where('type_name', $row['type_name'])->first();
            LegalAdvice::create([
                'advice_type_id' => $type?->id ?? AdviceType::first()->id,
                'topic'          => $row['topic'],
                'text'           => $row['text'],
                'requester'      => $row['requester'],
                'issuer'         => $row['issuer'],
                'advice_date'    => $row['advice_date'],
                'advice_number'  => $row['advice_number'],
                'attachment'     => $row['attachment'],
                'created_by'     => 1,
            ]);
        }

        // ✅ توليد بيانات عشوائية إضافية (15 فتوى/مذكرة مثلاً)
        $count = 15;
        $seq   = 1;

        // تأكد من وجود رابط التخزين إن حتستخدم مرفقات: php artisan storage:link
        if (!Storage::disk('public')->exists('legal_advices')) {
            Storage::disk('public')->makeDirectory('legal_advices');
        }

        for ($i = 0; $i < $count; $i++) {
            $type      = AdviceType::inRandomOrder()->first();
            $requester = $requesters[array_rand($requesters)];
            $issuer    = $issuers[array_rand($issuers)];
            $topic     = $topics[array_rand($topics)];
            $text      = $texts[array_rand($texts)];
            $year      = (int) Carbon::parse($randomDate())->format('Y'); // هنولد التاريخ مرة تانية أدناه
            $region    = $regionCodes[array_rand($regionCodes)];
            $prefix    = $prefixByDept[$requester] ?? 'GEN';

            // رقم الفتوى
            $adviceNumber = $makeAdviceNumber($region, $prefix, $year, $seq++);

            // تاريخ الفتوى
            $adviceDate = $randomDate();

            // مرفق اختياري: ملف نصّي بسيط
            $attachmentPath = null;
            if (rand(0, 1) === 1) {
                $fileName = $adviceNumber . '.txt';
                $attachmentPath = 'legal_advices/' . $fileName;
                Storage::disk('public')->put($attachmentPath,
                    "موضوع: {$topic}\nتاريخ: {$adviceDate}\nرقم: {$adviceNumber}\nملخص: {$text}"
                );
            }

            LegalAdvice::create([
                'advice_type_id' => $type->id,
                'topic'          => $topic,
                'text'           => $text,
                'requester'      => $requester,
                'issuer'         => $issuer,
                'advice_date'    => $adviceDate,
                'advice_number'  => $adviceNumber,
                'attachment'     => $attachmentPath, // مثال: public/legal_advices/...
                'created_by'     => 1,
            ]);
        }

        $this->command->info('✅ تم إنشاء آراء/فتاوى قانونية (ليبيا) مع أنواع بدون تكرار وأرقام مُنسَّقة ومرفقات اختيارية.');
    }
}
