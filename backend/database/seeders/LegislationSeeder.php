<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Legislation;

class LegislationSeeder extends Seeder
{
    public function run(): void
    {
        $laws = [
            [
                'decision_date' => '2024-04-01',
                'drafting' => 'تمت الصياغة',
                'issuing_entity' => 'وزارة العدل',
                'decision_number' => 'LAW-2024-001',
                'decision_topic' => 'تنظيم العمل عن بعد',
                'attachment' => 'laws/law-2024-001.pdf',
            ],
        ];

        foreach ($laws as $law) {
            Legislation::create($law);
        }
    }
}
