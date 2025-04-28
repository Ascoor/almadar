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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            
            $table->string('model_type'); // مفقودة عندك
            $table->unsignedBigInteger('model_id');
            $table->index(['model_type', 'model_id']);
            
            $table->string('file_path');
            $table->text('extracted_text')->nullable();
            $table->enum('file_type', ['pdf', 'word', 'image']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
