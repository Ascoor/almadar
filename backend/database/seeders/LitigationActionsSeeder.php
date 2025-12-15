<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Litigation;
use App\Models\LitigationAction;
use App\Models\LitigationActionType;
use App\Models\User;
use Illuminate\Support\Carbon;

class LitigationActionsSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ أنواع إجراءات قضائية
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

        // ✅ تأمين وجود الأنواع
        foreach ($actionTypes as $name) {
            LitigationActionType::firstOrCreate(['action_name' => $name]);
        }

        // ✅ جلب القضايا
        $litigations = Litigation::all();
        if ($litigations->isEmpty()) {
            $this->command->warn('⚠️ لا توجد قضايا. شغّل LitigationSeeder أولاً.');
            return;
        }

        // ✅ جلب المحامين فقط
        $lawyers = User::whereHas('roles', function ($q) {
            $q->where('name', 'lawyer');
        })->pluck('id');

        if ($lawyers->isEmpty()) {
            $this->command->warn('⚠️ لا يوجد مستخدمون بدور (lawyer).');
            return;
        }

        // ✅ محاكم / جهات ليبية
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

        foreach ($litigations as $litigation) {
            // 2–6 إجراءات لكل قضية
            $actionsCount = rand(2, 6);

            for ($i = 0; $i < $actionsCount; $i++) {
                $actionType = LitigationActionType::inRandomOrder()->first();

                LitigationAction::create([
                    'litigation_id'        => $litigation->id,
                    'action_type_id'       => $actionType->id,

                    // تاريخ واقعي
                    'action_date'          => Carbon::now()
                        ->subDays(rand(5, 700))
                        ->format('Y-m-d'),

                    // بيانات نصية
                    'requirements'         => fake('ar_SA')->optional()->sentence(6),
                    'results'              => fake('ar_SA')->optional()->sentence(7),
                    'notes'                => fake('ar_SA')->optional()->paragraph(2),

                    // ✅ التعيين لمحامي مسجّل
                    'assigned_to_user_id'  => $lawyers->random(),

                    // جهة / محكمة
                    'location'             => $libyanCourts[array_rand($libyanCourts)],

                    // حالة الإجراء
                    'status'               => fake()->randomElement([
                        'pending',
                        'in_review',
                        'done',
                    ]),

                    'created_by'           => 1,
                ]);
            }
        }

        $this->command->info('✅ تم إنشاء إجراءات قضائية وربطها بمحامين (lawyer) عشوائيًا.');
    }
}
