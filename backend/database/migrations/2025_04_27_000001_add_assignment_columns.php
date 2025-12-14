<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'contracts',
            'investigations',
            'legal_advices',
            'litigations',
            'litigation_actions',
            'investigation_actions',
        ];

        foreach ($tables as $table) {
            if (!Schema::hasTable($table)) {
                continue;
            }

            Schema::table($table, function (Blueprint $table) {
                $table->foreignId('assigned_to_user_id')->nullable()->after('updated_by')->constrained('users')->nullOnDelete();
                $table->foreignId('assigned_by_user_id')->nullable()->after('assigned_to_user_id')->constrained('users')->nullOnDelete();
                $table->foreignId('updated_by_user_id')->nullable()->after('assigned_by_user_id')->constrained('users')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        $tables = [
            'contracts',
            'investigations',
            'legal_advices',
            'litigations',
            'litigation_actions',
            'investigation_actions',
        ];

        foreach ($tables as $table) {
            if (!Schema::hasTable($table)) {
                continue;
            }

            Schema::table($table, function (Blueprint $table) {
                if (Schema::hasColumn($table->getTable(), 'assigned_to_user_id')) {
                    $table->dropConstrainedForeignId('assigned_to_user_id');
                }
                if (Schema::hasColumn($table->getTable(), 'assigned_by_user_id')) {
                    $table->dropConstrainedForeignId('assigned_by_user_id');
                }
                if (Schema::hasColumn($table->getTable(), 'updated_by_user_id')) {
                    $table->dropConstrainedForeignId('updated_by_user_id');
                }
            });
        }
    }
};
