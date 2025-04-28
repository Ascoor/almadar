<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InvestigationAction;

class InvestigationActionSeeder extends Seeder
{
    public function run(): void
    {
        $actions = [
            [
                'investigation_id' => 1,
                'date' => '2024-01-10',
                'type' => 'جلسة استماع',
                'officer' => 'مفتاح الورفلي',
                'required_action' => 'توضيح أسباب التأخير',
                'result' => 'تم الاستماع للموظف',
                'status' => 'منجز',
            ],
        ];

        foreach ($actions as $action) {
            InvestigationAction::create($action);
        }
    }
}
