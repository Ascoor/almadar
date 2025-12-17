<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\City;
use Illuminate\Database\Seeder;

class LibyaLocationsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'طرابلس' => ['زاوية الدهماني', 'أبوسليم', 'تاجوراء', 'عين زارة'],
            'بنغازي' => ['البركة', 'السلماني', 'الفويهات', 'الكيش'],
            'مصراتة' => ['الكراريم', 'المعادي', 'الغاية'],
            'سبها' => ['القرضة', 'حي الجديد', 'الثانوية'],
            'الزاوية' => ['وسط المدينة', 'المصفاة'],
            'درنة' => ['المدينة القديمة', 'الشرقية'],
            'سرت' => ['الجيزة العسكرية', 'المدينة'],
            'البيضاء' => ['القصور', 'البياضة'],
            'غريان' => ['القواسم', 'الرحيبات'],
            'زليتن' => ['سوق الجمعة', 'مركز المدينة'],
        ];

        foreach ($data as $city => $areas) {
            $cityModel = City::firstOrCreate(['name_ar' => $city], ['name_en' => null]);
            foreach ($areas as $area) {
                Area::firstOrCreate(['city_id' => $cityModel->id, 'name_ar' => $area], ['name_en' => null]);
            }
        }
    }
}
