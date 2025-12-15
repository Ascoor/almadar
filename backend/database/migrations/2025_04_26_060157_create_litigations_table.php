<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // إنشاء جدول "litigations"
        Schema::create('litigations', function (Blueprint $table) {
            $table->id();

            $table->enum('scope', ['from', 'against']);  // نوع الدعوى (دولي أو محلي)
            $table->string('case_number');                // رقم القضية
$table->unsignedSmallInteger('case_year');
            $table->string('opponent');                   // الخصم
            $table->string('court');                      // المحكمة
            $table->date('filing_date');                  // تاريخ تقديم الدعوى
            $table->string('subject');                    // نوع الدعوى
            $table->enum('status', ['open', 'in_progress', 'closed'])->default('open'); // حالة الدعوى
            $table->string('notes')->nullable();          // ملاحظات
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

        // إنشاء جدول "litigation_action_types"
        Schema::create('litigation_action_types', function (Blueprint $table) {
            $table->id();
            $table->string('action_name');  // اسم نوع الإجراء
            $table->timestamps();
        });

        // إنشاء جدول "litigation_actions"
        Schema::create('litigation_actions', function (Blueprint $table) {
            $table->id();
                   $table->foreignId('created_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

      
            $table->foreignId('updated_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            // الربط مع جدول "litigations"
            $table->foreignId('litigation_id')->constrained()->onDelete('cascade');

            // الربط مع جدول "litigation_action_types"
            $table->foreignId('action_type_id')
                  ->constrained('litigation_action_types')
                  ->onDelete('cascade');  // إذا تم حذف نوع الإجراء، يتم حذف الإجراءات المرتبطة به.

            $table->date('action_date');  // تاريخ الإجراء
            $table->string('requirements')->nullable();  // الطلبات
            $table->string('results')->nullable();  // النتيجة
 
            $table->string('location');  // مكان الإجراء
            $table->longText('notes')->nullable();  // ملاحظات المتابعة
            $table->enum('status', ['pending', 'in_review', 'done'])->default('pending');  // حالة الإجراء
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // حذف الجداول في حالة التراجع عن الميجريشن
        Schema::dropIfExists('litigation_actions');
        Schema::dropIfExists('litigation_action_types');
        Schema::dropIfExists('litigations');
    }
};
