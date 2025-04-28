<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [
            [
                'name' => 'أحمد علي الزوي',
                'position' => 'مدير إدارة العقود',
                'department' => 'إدارة العقود المحلية',
            ],
            [
                'name' => 'خالد محمد الديب',
                'position' => 'أخصائي قانوني',
                'department' => 'الشؤون القانونية',
            ],
            [
                'name' => 'سعاد عبدالسلام المجبري',
                'position' => 'محامية',
                'department' => 'إدارة الشكاوى والتحقيقات',
            ],
            [
                'name' => 'طارق السنوسي الطبال',
                'position' => 'مدير إدارة الشؤون الإدارية',
                'department' => 'الشؤون الإدارية',
            ],
            [
                'name' => 'نجلاء فتحي الفاخري',
                'position' => 'مستشار قانوني',
                'department' => 'وحدة المشورة القانونية',
            ],
            [
                'name' => 'مفتاح خليفة الورفلي',
                'position' => 'باحث قانوني',
                'department' => 'وحدة التقاضي',
            ],
            [
                'name' => 'ريم يوسف الدرسي',
                'position' => 'أخصائي تعاقدات دولية',
                'department' => 'إدارة العقود الدولية',
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}
