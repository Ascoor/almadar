<?php

namespace Database\Seeders;

use App\Models\Area;
use App\Models\City;
use App\Models\District;
use Illuminate\Database\Seeder;

class LibyaLocationsSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'طرابلس' => [
                'جنزور' => ['السراج', 'غوط الشعال', 'قرقارش'],
                'أبو سليم' => ['الهضبة', 'حي الملجأ', 'عين زارة'],
            ],
            'بنغازي' => [
                'بنغازي المركز' => ['السلماني', 'الفويهات', 'الكيش'],
                'قاريونس' => ['قاريونس', 'الهواري'],
            ],
            'مصراتة' => [
                'مصراتة المدينة' => ['الجزيرة', 'الرعفة'],
            ],
            'سبها' => [
                'سبها الكبرى' => ['الجديد', 'حي المطار'],
            ],
            'الزاوية' => [
                'الزاوية المركز' => ['المعهد', 'وسط المدينة'],
            ],
            'درنة' => [
                'درنة المركز' => ['الشعبية', 'باب طبرق'],
            ],
            'سرت' => [
                'سرت المركز' => ['الجيزة العسكرية', 'الألف وحدة'],
            ],
            'البيضاء' => [
                'البيضاء المدينة' => ['شهداء ليبيا', 'المثابة'],
            ],
            'غريان' => [
                'غريان المدينة' => ['القواسم', 'المحطة'],
            ],
            'زليتن' => [
                'زليتن المدينة' => ['ماجر', 'وسط المدينة'],
            ],
        ];

        foreach ($data as $cityName => $districts) {
            $city = City::firstOrCreate(['name' => $cityName]);
            foreach ($districts as $districtName => $areas) {
                $district = District::firstOrCreate([
                    'city_id' => $city->id,
                    'name' => $districtName,
                ]);

                foreach ($areas as $areaName) {
                    Area::firstOrCreate([
                        'district_id' => $district->id,
                        'name' => $areaName,
                    ]);
                }
            }
        }
    }
}
