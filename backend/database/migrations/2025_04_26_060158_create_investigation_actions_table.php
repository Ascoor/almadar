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
        // إنشاء جدول أنواع إجراءات التحقيق
        Schema::create('investigation_action_types', function (Blueprint $table) {
            $table->id();     
            $table->string('action_name');  // اسم نوع الإجراء
            $table->timestamps();  // التاريخ الزمني
        });

        // إنشاء جدول إجراءات التحقيق
        Schema::create('investigation_actions', function (Blueprint $table) {
            $table->id();

            // العلاقة مع جدول التحقيقات
            $table->foreignId('investigation_id')->constrained('investigations')->onDelete('cascade');
            
            $table->date('action_date');               // تاريخ الإجراء
            $table->foreignId('action_type_id')        // العلاقة مع جدول أنواع الإجراءات
                  ->constrained('investigation_action_types')
                  ->onDelete('cascade');
            $table->string('officer_name');            // اسم الضابط القائم بالإجراء
            $table->text('requirements')->nullable();  // الطلبات الخاصة بالإجراء
            $table->text('results')->nullable(); 
                        $table->foreignId('created_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

      
            $table->foreignId('updated_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();     // النتائج
            $table->enum('status', ['pending', 'done', 'cancelled', 'in_review'])->default('pending');  // حالة الإجراء
            $table->timestamps();  // التاريخ الزمني
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // حذف جداول الإجراءات إذا لزم الأمر
        Schema::dropIfExists('investigation_actions');
        Schema::dropIfExists('investigation_action_types');
    }
};
