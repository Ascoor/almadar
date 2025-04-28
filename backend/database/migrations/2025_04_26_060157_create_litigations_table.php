<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('litigations', function (Blueprint $table) {
            $table->id();
            $table->string('case_number')->unique();      // رقم القضية
            $table->string('opponent');                   // الخصم
            $table->enum('direction', ['against_company', 'from_company']); // اتجاه القضية
            $table->enum('stage', ['ابتدائي', 'استئناف', 'نقض']);          // مرحلة القضية
            $table->enum('status', ['open', 'closed', 'pending'])->default('open'); // حالة القضية
            $table->string('court_name')->nullable();     // اسم المحكمة
            $table->date('next_session_date')->nullable(); // تاريخ الجلسة القادمة
            $table->text('notes')->nullable();            // ملاحظات إضافية
            $table->string('attachment')->nullable();     // مرفقات (PDF مثلاً)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('litigations');
    }
};
