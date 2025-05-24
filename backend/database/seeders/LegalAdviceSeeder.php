<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LegalAdvice;
use App\Models\AdviceType;
use Illuminate\Support\Facades\Storage;

class LegalAdviceSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'قرار',        // مثال: قرار صادر من جهة معينة
            'إرساء قانوني', // مثال: قانون جديد يتم إرساؤه
            'فتوى',        // مثال: فتوى قانونية صادرة من جهة مختصة
            'تعديل قانوني', // مثال: تعديل على قانون موجود
            'مذكرة تفسيرية', // مثال: مذكرة لتفسير قانون
        ];

        foreach ($types as $type) {
            AdviceType::create([
                'type_name' => $type
            ]);
        }

        $advices = [
            [
                //random type_id
                'advice_type_id' => AdviceType::inRandomOrder()->first()->id,
                'topic' => 'تجديد عقد توريد',
                'text' => 'بعد المراجعة، يجوز تجديد العقد وفقًا للشروط السابقة.',
                'requester' => 'إدارة المشتريات',
                'issuer' => 'الإدارة القانونية',
                'advice_date' => '2024-01-15',
                'advice_number' => 'MSH-001',
                'attachment' => null,
                  'created_by' => 1, // ✅ مضاف
            ],
            [
                'advice_type_id' => AdviceType::inRandomOrder()->first()->id,
                'topic' => 'بدل المخاطر',
                'text' => 'يُستحق البدل فقط في الحالات المعتمدة بلائحة المخاطر.',
                'requester' => 'شؤون الموظفين',
                'issuer' => 'الإدارة القانونية',
                'advice_date' => '2024-02-03',
                'advice_number' => 'MSH-002',
                'attachment' => null,
                  'created_by' => 1, // ✅ مضاف
            ],
            [
                'advice_type_id' => AdviceType::inRandomOrder()->first()->id,
                'topic' => 'إنهاء عقد عمل',
                'text' => 'يجب إخطار الموظف رسميًا قبل 30 يومًا من إنهاء التعاقد.',
                'requester' => 'إدارة الموارد البشرية',
                'issuer' => 'الإدارة القانونية',
                'advice_date' => '2024-03-10',
                'advice_number' => 'HR-2024-001',
                'attachment' => null,
                  'created_by' => 1, // ✅ مضاف
            ],
            [
                'advice_type_id' => AdviceType::inRandomOrder()->first()->id,
                'topic' => 'مناقصة جديدة',
                'text' => 'يجب الالتزام بقانون المشتريات الحكومية رقم 12 لسنة 2022.',
                'requester' => 'المالية',
                'issuer' => 'الإدارة القانونية',
                'advice_date' => '2024-04-01',
                'advice_number' => 'FN-2024-017',
                'attachment' => null,
                  'created_by' => 1, // ✅ مضاف
            ],
        ];

        foreach ($advices as $advice) {
            LegalAdvice::create($advice);
        }
    }
}
