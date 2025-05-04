<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LegalAdvice;
use Illuminate\Support\Facades\Storage;

class LegalAdviceSeeder extends Seeder
{
    public function run(): void
    {
        $advices = [
            [
                'type' => 'رأي قانوني',
                'topic' => 'تجديد عقد توريد',
                'text' => 'بعد المراجعة، يجوز تجديد العقد وفقًا للشروط السابقة.',
                'requester' => 'إدارة المشتريات',
                'issuer' => 'الإدارة القانونية',
                'advice_date' => '2024-01-15',
                'advice_number' => 'MSH-001',
                'attachment' => null,
            ],
            [
                'type' => 'تفسير قانوني',
                'topic' => 'بدل المخاطر',
                'text' => 'يُستحق البدل فقط في الحالات المعتمدة بلائحة المخاطر.',
                'requester' => 'شؤون الموظفين',
                'issuer' => 'الإدارة القانونية',
                'advice_date' => '2024-02-03',
                'advice_number' => 'MSH-002',
                'attachment' => null,
            ],
            [
                'type' => 'رأي قانوني',
                'topic' => 'إنهاء عقد عمل',
                'text' => 'يجب إخطار الموظف رسميًا قبل 30 يومًا من إنهاء التعاقد.',
                'requester' => 'إدارة الموارد البشرية',
                'issuer' => 'الإدارة القانونية',
                'advice_date' => '2024-03-10',
                'advice_number' => 'HR-2024-001',
                'attachment' => null,
            ],
            [
                'type' => 'استشارة قانونية',
                'topic' => 'مناقصة جديدة',
                'text' => 'يجب الالتزام بقانون المشتريات الحكومية رقم 12 لسنة 2022.',
                'requester' => 'المالية',
                'issuer' => 'الإدارة القانونية',
                'advice_date' => '2024-04-01',
                'advice_number' => 'FN-2024-017',
                'attachment' => null,
            ],
        ];

        foreach ($advices as $advice) {
            LegalAdvice::create($advice);
        }
    }
}
