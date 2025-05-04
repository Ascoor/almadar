<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Litigation;
use App\Models\LitigationAction;
use Illuminate\Support\Carbon;

class LitigationActionsSeeder extends Seeder
{
    public function run(): void
    {
        $litigations = Litigation::all();

        if ($litigations->isEmpty()) {
            $this->command->warn('⚠️ لا توجد قضايا في قاعدة البيانات. تأكد من تشغيل LitigationSeeder أولاً.');
            return;
        }

        foreach ($litigations as $litigation) {
            // لكل قضية نضيف من 1 إلى 4 إجراءات
            $actionsCount = rand(1, 4);

            for ($i = 0; $i < $actionsCount; $i++) {
                LitigationAction::create([
                    'litigation_id' => $litigation->id,
                    'action_type'   => fake()->randomElement(['جلسة مرافعة', 'مذكرة رد', 'طلب تأجيل', 'جلسة نطق بالحكم']),
                    'action_date'   => Carbon::now()->subDays(rand(1, 200)),
                    'requirements'  => fake()->optional()->sentence(4),
                    'results'       => fake()->optional()->sentence(5),
                    'lawyer_name'   => fake()->name(),
                    'location'      => fake()->randomElement(['محكمة الرياض', 'محكمة جدة', 'محكمة الدمام']),
                    'notes'         => fake()->optional()->paragraph(2),
                    'status'        => fake()->randomElement(['pending', 'in_review', 'done']),
                ]);
            }
        }

        $this->command->info('✅ تم إنشاء إجراءات قضائية بشكل عشوائي لكل قضية.');
    }
}
