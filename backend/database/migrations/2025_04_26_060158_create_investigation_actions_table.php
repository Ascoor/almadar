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
    Schema::create('investigation_actions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('investigation_id')->constrained('investigations')->onDelete('cascade');
        $table->date('action_date');              // تاريخ الإجراء
        $table->string('action_type');             // نوع الإجراء (جلسة استماع، استجواب، تقرير...)
        $table->string('officer_name');            // اسم المسؤول عن الإجراء
        $table->text('requirements')->nullable(); // المطلوبات
        $table->text('results')->nullable();       // النتائج المنجزة
        $table->enum('status', ['pending', 'done', 'cancelled', 'in_review'])->default('pending');
        $table->timestamps();
    });
    
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investigation_actions');
    }
};
