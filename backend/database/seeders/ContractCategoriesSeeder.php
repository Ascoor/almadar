<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContractCategory;

class ContractCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // فئات عقود بطابع ليبي تغطي أعمال النفط، البنية التحتية، والاتصالات
        $categories = [
            'توريد مواد تشغيلية',
            'مقاولات بنية تحتية وطرق',
            'خدمات استشارية وقانونية',
            'صيانة وتشغيل محطات كهرباء',
            'تقنية معلومات وشبكات',
            'خدمات لوجستية للمناطق الجنوبية',
            'تصميم وإنشاء مرافق حكومية',
            'استثمار وشراكات مع البلديات',
            'تأجير معدات ثقيلة',
            'تدريب وتطوير للكوادر الوطنية',
            'تشغيل موانئ ومطارات',
            'خدمات نفطية وغاز',
        ];

        foreach ($categories as $category) {
            ContractCategory::create([
                'name' => $category,
            ]);
        }
    }
}
