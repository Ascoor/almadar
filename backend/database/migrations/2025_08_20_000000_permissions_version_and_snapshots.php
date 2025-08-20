<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $t) {
            $t->unsignedBigInteger('permissions_version')->default(0);
        });
        Schema::create('permission_snapshots', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->json('payload');
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('permission_snapshots');
        Schema::table('users', fn(Blueprint $t) => $t->dropColumn('permissions_version'));
    }
};
