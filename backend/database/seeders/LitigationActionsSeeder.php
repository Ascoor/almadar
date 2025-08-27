<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Litigation;
use App\Models\LitigationAction;
use App\Models\LitigationActionType;
use Illuminate\Support\Carbon;

class LitigationActionsSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ أنواع إجراءات ليبية (وإصلاح "نصوير" -> "تصوير")
        $actionTypes = [
            'اطلاع',
            'تصوير',
            'إعلان',
            'جلسة',
            'جلسة مرافعة',
            'مذكرة رد',
            'طلب تأجيل',
            'طعن',
            'جلسة نطق بالحكم',
        ];

        // ✅ تأمين وجود الأنواع بدون تكرار
        foreach ($actionTypes as $name) {
            LitigationActionType::firstOrCreate(['action_name' => $name]);
        }

        // ✅ استرجاع القضايا
        $litigations = Litigation::all();
        if ($litigations->isEmpty()) {
            $this->command->warn('⚠️ لا توجد قضايا في قاعدة البيانات. شغّل LitigationSeeder أولاً.');
            return;
        }

        // ✅ أماكن/محاكم ليبية
        $libyanCourts = [
            'محكمة طرابلس الابتدائية',
            'محكمة شمال طرابلس الابتدائية',
            'محكمة بنغازي الابتدائية',
            'محكمة مصراتة الابتدائية',
            'محكمة سبها الابتدائية',
            'محكمة البيضاء الابتدائية',
            'محكمة درنة الابتدائية',
            'محكمة الزاوية الابتدائية',
            'محكمة غريان الابتدائية',
            'محكمة سرت الابتدائية',
            'محكمة طرابلس التجارية',
            'محكمة بنغازي التجارية',
        ];

        // ✅ أسماء محامين عيّنة
        $lawyers = [
            'المحامي محمد الطرابلسي',
            'المحامية هدى البنغازية',
            'الأستاذ علي المصراتي',
            'الأستاذة سمية السبهاوية',
            'الأستاذ طارق الزاوي',
            'الأستاذ عادل السرتاوي',
            'المحامية مروة البيضاء',
        ];

        foreach ($litigations as $litigation) {
            // هنعمل 2–6 إجراءات لكل قضية
            $actionsCount = rand(2, 6);

            for ($i = 0; $i < $actionsCount; $i++) {
                $actionType = LitigationActionType::inRandomOrder()->first();

                LitigationAction::create([
                    'litigation_id' => $litigation->id,
                    'action_type_id' => $actionType->id,

                    // تاريخ واقعي خلال آخر سنتين
                    'action_date'   => Carbon::now()->subDays(rand(5, 700))->format('Y-m-d'),

                    // متطلبات/نتائج عربية مختصرة
                    'requirements'  => fake('ar_SA')->optional()->sentence(6),
                    'results'       => fake('ar_SA')->optional()->sentence(7),

                    // محامي وموقع ليبي
                    'lawyer_name'   => $lawyers[array_rand($lawyers)],
                    'location'      => $libyanCourts[array_rand($libyanCourts)],

                    'notes'         => fake('ar_SA')->optional()->paragraph(2),

                    // حالات مناسبة لسير الإجراءات
                    'status'        => fake()->randomElement(['pending', 'in_review', 'done']),

                    'created_by'    => 1,
                ]);
            }
        }

        $this->command->info('✅ تم إنشاء إجراءات قضائية (ليبيا) عشوائيًا لكل قضية.');
    }
}
