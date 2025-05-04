<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('legal_advices', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('topic');
            $table->text('text');
            $table->string('requester');
            $table->string('issuer');
            $table->date('advice_date');
            $table->string('advice_number')->unique();
            $table->string('attachment')->nullable(); // ملف PDF مرفق
            $table->text('notes')->nullable(); // ملاحظات إضافية
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legal_advices');
    }
};
