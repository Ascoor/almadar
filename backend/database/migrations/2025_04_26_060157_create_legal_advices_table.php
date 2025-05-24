<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
      
        Schema::create('advice_types', function (Blueprint $table) {
            $table->id();
            $table->string('type_name');  // اسم نوع التشريع (تمت الصياغة / قيد الصياغة)
            $table->timestamps();
        });
        Schema::create('legal_advices', function (Blueprint $table) {
            $table->id();
  
            // العلاقة مع جدول التحقيقات
            $table->foreignId('advice_type_id')->constrained('advice_types')->onDelete('cascade');
            
            $table->string('topic');
            $table->text('text');
            $table->string('requester');
            $table->string('issuer');
            $table->date('advice_date');
            $table->string('advice_number')->unique();
            $table->string('attachment')->nullable(); // ملف PDF مرفق
            $table->text('notes')->nullable(); // ملاحظات إضافية
                        $table->foreignId('created_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

      
            $table->foreignId('updated_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legal_advices');
    }
};
