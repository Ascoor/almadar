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
        $table->date('date');
        $table->string('type');
        $table->string('officer');
        $table->string('required')->nullable();
        $table->string('result')->nullable();
        $table->enum('status', ['done', 'in_review', 'pending'])->default('pending');
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
