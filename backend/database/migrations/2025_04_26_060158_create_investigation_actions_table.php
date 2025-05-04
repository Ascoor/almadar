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
        $table->date('action_date');              
        $table->string('action_type');           
        $table->string('officer_name');            
        $table->text('requirements')->nullable(); 
        $table->text('results')->nullable();      
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
