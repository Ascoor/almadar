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
        Schema::create('litigation_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('litigation_id')->constrained('litigations')->onDelete('cascade');
            $table->string('action_type'); // نوع الإجراء (مثلا: جلسة، مذكرة، حكم)
            $table->date('action_date')->nullable(); // تاريخ الإجراء
            $table->text('details')->nullable(); // تفاصيل إضافية عن الإجراء
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('litigation_actions');
    }
};
