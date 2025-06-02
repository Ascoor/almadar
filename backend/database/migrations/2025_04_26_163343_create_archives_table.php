<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('archives', function (Blueprint $table) {
            $table->id();
            $table->string('model_type');  // نوع الكيان المرتبط (مثلاً: Contract, Consultation, Case)
            $table->unsignedBigInteger('model_id'); // رقم السجل المرتبط
            $table->string('number')->nullable(); // عنوان المستند أو اسمه
            $table->string('title')->nullable(); // عنوان المستند أو اسمه
            $table->string('file_path'); // مسار الملف (PDF أو Word)
            $table->longText('extracted_text')->nullable(); // النص المستخرج لعملية البحث
 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archives');
    }
};
