<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Investigation;
use App\Models\InvestigationAction;
use Carbon\Carbon;

class InvestigationActionSeeder extends Seeder
{
    public function run(): void
    {
        $actionTypes = ['جلسة استماع', 'مذكرة تفسيرية', 'طلب إفادة', 'تحقيق رسمي', 'جلسة تحقيق'];
        $officers = ['أ. خالد علي', 'أ. مريم صالح', 'أ. عبدالله حسن', 'د. فاطمة عبدالعزيز'];

        $investigations = Investigation::all();

        foreach ($investigations as $investigation) {
            foreach (range(1, rand(1, 3)) as $j) { // كل تحقيق بين 1-3 إجراءات
                InvestigationAction::create([
                    'investigation_id' => $investigation->id,
                    'action_date' => Carbon::now()->subDays(rand(1, 60))->format('Y-m-d'),
                    'action_type' => $actionTypes[array_rand($actionTypes)],
                    'officer_name' => $officers[array_rand($officers)],
                    'requirements' => 'تقديم مبررات كتابية',
                    'results' => rand(0, 1) ? 'تم الاستماع إلى الموظف' : 'جارٍ دراسة الموضوع',
                    'status' => ['pending', 'in_review', 'done'][rand(0, 2)],
                ]);
            }
        }
    }
}
