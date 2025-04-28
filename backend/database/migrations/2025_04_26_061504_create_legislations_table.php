<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('legislations', function (Blueprint $table) {
            $table->id();
            $table->date('decision_date');        // تاريخ القرار
            $table->string('drafting');            // حالة الصياغة (تمت الصياغة / قيد الصياغة)
            $table->string('issuing_entity');      // جهة الإصدار (مثلا وزارة العدل)
            $table->string('decision_number');     // رقم القرار (مثلا 99/2023)
            $table->string('decision_topic');      // موضوع القرار (مثلا تنظيم العمل عن بعد)
            $table->string('attachment')->nullable(); // رابط المرفق لو موجود
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legislations');
    }
};
