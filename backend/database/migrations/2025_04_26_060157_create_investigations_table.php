<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('investigations', function (Blueprint $table) {
            $table->id();
            $table->string('employee_name');            // اسم الموظف
            $table->string('source');                    // الجهة المحيل منها
            $table->string('subject');         
            $table->string('decision')->nullable(); // ✅ إضافة هذا السطر          // موضوع التحقيق
            $table->string('case_number')->nullable();   // رقم الدعوى أو التحقيق
            $table->enum('status', ['open', 'in_progress', 'closed'])->default('open'); // حالة التحقيق
            $table->text('notes')->nullable();   
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
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investigations');
    }
};
