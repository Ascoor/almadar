<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Investigation;

class InvestigationSeeder extends Seeder
{
    public function run(): void
    {
        $sources = ['إدارة الموارد البشرية', 'الشؤون القانونية', 'الإدارة العامة', 'الرقابة والتفتيش'];
        $subjects = ['تأخير متكرر', 'سوء سلوك وظيفي', 'خروج دون إذن', 'إفشاء أسرار عمل', 'تقصير في الأداء'];

        foreach (range(1, 10) as $i) {
            Investigation::create([
                'employee_name' => 'موظف ' . $i,
                'source' => $sources[array_rand($sources)],
                'subject' => $subjects[array_rand($subjects)],
                'case_number' => 'INV-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'decision' => null,
                'status' => 'open',
            ]);
        }
    }
}
