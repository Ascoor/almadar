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

            $table->enum('scope', ['from', 'against']); // فقط دولي أو محلي
            $table->string('case_number');        // الخصوم
            $table->string('opponent');        // الخصوم
            $table->string('court');            // المحكمة
            $table->date('filing_date');        // تاريخ الدعوى
            $table->string('subject');     // نوع الدعوى
            $table->enum('status', ['open', 'in_progress', 'closed'])->default('open'); // حالة الدعوى
            
            $table->string('notes');     // نوع الدعوى
            $table->timestamps();
        }); 
  
        Schema::create('litigation_actions', function (Blueprint $table) {
            $table->id();
        
            $table->foreignId('litigation_id')->constrained()->onDelete('cascade');
        
            $table->string('action_type');                     // نوع الإجراء
            $table->date('action_date');                       // تاريخ الإجراء
            $table->string('requirements')->nullable();        // الطلبات
            $table->string('results')->nullable();             // النتيجة
            $table->string('lawyer_name');                     // القائم بالإجراء
            $table->string('location');                        // مكان الإجراء
            $table->longText('notes')->nullable();             // ملاحظات المتابعة
            $table->enum('status', ['pending', 'in_review', 'done'])->default('pending'); // حالة الإجراء
        
            $table->timestamps();
        });
        
        
        
    }

    public function down(): void
    {
        Schema::dropIfExists('litigations');
        Schema::dropIfExists('litigation_actions');
    }
};
