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
    Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // ربط بالإشعار المستخدم
            $table->morphs('notifiable'); // إضافة علاقة polymorphic (يتم إضافة both notifiable_id و notifiable_type)
            $table->string('title');
            $table->text('message')->nullable();
            $table->string('link')->nullable(); // رابط التفاصيل
            $table->boolean('read')->default(false);
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
