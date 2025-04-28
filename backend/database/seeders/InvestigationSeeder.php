<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Investigation;

class InvestigationSeeder extends Seeder
{
    public function run(): void
    {
        $investigations = [
            [
                'employee_id' => 1,
                'source' => 'إدارة الشكاوى',
                'subject' => 'تأخير في العمل',
                'case_number' => 'INV-001',
                'decision' => 'إنذار كتابي',
                'status' => 'مغلق',
            ],
        ];

        foreach ($investigations as $inv) {
            Investigation::create($inv);
        }
    }
}
