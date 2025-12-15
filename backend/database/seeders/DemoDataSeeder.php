<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\ContractCategory;
use App\Models\Investigation;
use App\Models\InvestigationAction;
use App\Models\InvestigationActionType;
use App\Models\LegalAdvice;
use App\Models\AdviceType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = $this->user('admin@example.test');
        $manager = $this->user('manager@example.test');
        $lawyer = $this->user('lawyer@example.test');
        $investigator = $this->user('investigator@example.test');
        $employee = $this->user('employee@example.test');

        $categoryAttributes = ['name' => 'Demo'];

        if (Schema::hasColumn('contract_categories', 'description')) {
            $categoryAttributes['description'] = 'Demo';
        }

        $category = ContractCategory::first() ?? ContractCategory::create($categoryAttributes);
        $procedureType = InvestigationActionType::updateOrCreate(
            ['action_name' => 'جمع الاستبيانات'],
            []
        );
        
        $adviceType = AdviceType::first() ?? AdviceType::create([
            'type_name' => 'استشارة عقد',
        ]);

        Contract::updateOrCreate(
            ['number' => 'CNT-001'],
            [
                'contract_category_id' => $category->id,
                'scope' => 'local',
                'contract_parties' => 'Demo Parties',
                'value' => 10000,
                'start_date' => now()->subMonth(),
                'end_date' => now()->addMonths(3),
                'status' => 'active',
                'summary' => 'Baseline demo contract',
                'created_by' => $employee?->id,
                'updated_by' => $employee?->id,
                'assigned_to_user_id' => $lawyer?->id,
                'assigned_by_user_id' => $manager?->id,
            ]
        );

        $investigation = Investigation::updateOrCreate(
            ['case_number' => 'INV-100'],
            [
                'employee_name' => 'Ahmed Ali',
                'source' => 'HR Department',
                'subject' => 'Policy violation review',
                'decision' => 'Pending',
                'status' => 'in_progress',
                'notes' => 'Demo investigation',
                'created_by' => $admin?->id,
                'updated_by' => $admin?->id,
                'assigned_to_user_id' => $investigator?->id,
                'assigned_by_user_id' => $admin?->id,
            ]
        );

        InvestigationAction::updateOrCreate(
            ['investigation_id' => $investigation->id, 'action_type_id' => $procedureType->id],
            [
                'action_date' => now()->toDateString(),
                'officer_name' => 'Karim Investigator',
                'requirements' => 'Collect statements',
                'results' => 'Pending',
                'status' => 'pending',
                'created_by' => $investigator?->id,
                'assigned_to_user_id' => $investigator?->id,
                'assigned_by_user_id' => $admin?->id,
            ]
        );

        LegalAdvice::updateOrCreate(
            ['advice_number' => 'ADV-001'],
            [
                'advice_type_id' => $adviceType->id,
                'topic' => 'Contract review',
                'text' => 'Review of the baseline contract',
                'requester' => 'HR',
                'issuer' => 'Legal Team',
                'advice_date' => now()->toDateString(),
                'notes' => 'Demo advice',
                'created_by' => $manager?->id,
                'assigned_to_user_id' => $lawyer?->id,
                'assigned_by_user_id' => $manager?->id,
            ]
        );
    }

    private function user(string $email)
    {
        return \App\Models\User::where('email', $email)->first();
    }
}
