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
        Schema::create('contract_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');   
            $table->timestamps();
        });
        
  

         Schema::create('contracts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('contract_category_id')
                  ->constrained('contract_categories')
                  ->onDelete('cascade');

            $table->enum('scope', ['local', 'international']);   
            $table->string('number')->unique();
            $table->string('contract_parties'); 
            $table->double('value', 18, 2)->nullable(); 
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('attachment')->nullable();
            $table->enum('status', ['active', 'expired', 'terminated', 'pending', 'cancelled'])->default('active');
            $table->text('summary')->nullable();
 
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
        Schema::dropIfExists('contract_categories'); 
        Schema::dropIfExists('contracts');
    }
};
