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
        $categories = [
            'توريد',
            'مقاولات',
            'خدمات استشارية',
            'صيانة وتشغيل',
            'تقنية معلومات',
            'خدمات لوجستية',
            'تصميم وإنشاء',
            'استثمار',
            'تأجير',
            'تدريب وتطوير',
        ];

        foreach ($categories as $category) {
            ContractCategory::create([
                'name' => $category,
            ]);
        }
    }
}
