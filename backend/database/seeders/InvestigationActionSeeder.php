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
            'جلسة استماع بمكتب طرابلس',
            'مذكرة تفسيرية عن إجراءات المناولة في الميناء',
            'طلب إفادة من فرع المنطقة الشرقية',
            'تحقيق رسمي بخصوص مشروع طرق الجنوب',
            'جلسة تحقيق حول سلامة المواقع النفطية'
        ];

        foreach ($actionTypes as $actionType) {
            InvestigationActionType::create([
                'action_name' => $actionType
            ]);
        }

        // إنشاء قائمة الضباط
        $officers = ['أ. نبيل الزروق', 'أ. مروان الدرسي', 'أ. كوثر بن عمران', 'د. فاطمة الشريف', 'م. عبدالقادر المقريف'];

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
                    'action_type_id' => $actionType->id,
                    'officer_name' => $officers[array_rand($officers)],
                    'requirements' => 'إرفاق محاضر رسمية وأدلة من مواقع العمل في ليبيا',
                    'results' => rand(0, 1)
                        ? 'تم الاستماع للموظف وتوثيق أقواله في محضر بنغازي'
                        : 'جارٍ دراسة الموضوع بالتنسيق مع إدارة التفتيش في طرابلس',
                    'status' => ['pending', 'in_review', 'done'][rand(0, 2)],
                    'created_by' => 1, // ✅ مضاف
                ]);

            }
        }
    }
}
