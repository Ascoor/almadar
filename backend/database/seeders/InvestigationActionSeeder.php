<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Investigation;
use App\Models\InvestigationAction;
use App\Models\InvestigationActionType;
use Carbon\Carbon;

class InvestigationActionSeeder extends Seeder
{
    public function run(): void
    {
        // إدخال أنواع الإجراءات في جدول investigation_action_types
        $actionTypes = [
            'جلسة استماع', 
            'مذكرة تفسيرية', 
            'طلب إفادة', 
            'تحقيق رسمي', 
            'جلسة تحقيق'
        ];

        foreach ($actionTypes as $actionType) {
            InvestigationActionType::create([
                'action_name' => $actionType
            ]);
        }

        // إنشاء قائمة الضباط
        $officers = ['أ. خالد علي', 'أ. مريم صالح', 'أ. عبدالله حسن', 'د. فاطمة عبدالعزيز'];

        // استرجاع جميع التحقيقات من قاعدة البيانات
        $investigations = Investigation::all();

        // لضمان إنشاء 50 عنصر
        foreach (range(1, 50) as $i) { // إنشاء 50 عنصر
            foreach (range(1, rand(1, 3)) as $j) { // كل تحقيق بين 1-3 إجراءات
                // اختيار نوع الإجراء عشوائيًا من جدول investigation_action_types
                $actionType = InvestigationActionType::inRandomOrder()->first();

                InvestigationAction::create([
                    'investigation_id' => $investigations->random()->id,
                    'action_date' => Carbon::now()->subDays(rand(1, 60))->format('Y-m-d'),
                    'action_type_id' => $actionType->id,  // ربط الإجراء باستخدام id من جدول investigation_action_types
                    'officer_name' => $officers[array_rand($officers)],
                    'requirements' => 'تقديم مبررات كتابية',
                    'results' => rand(0, 1) ? 'تم الاستماع إلى الموظف' : 'جارٍ دراسة الموضوع',
                    'status' => ['pending', 'in_review', 'done'][rand(0, 2)],
                ]);
            }
        }
    }
}
