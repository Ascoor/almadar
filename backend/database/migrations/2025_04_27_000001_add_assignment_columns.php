<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = [
        'contracts',
        'investigations',
        'legal_advices',
        'litigations',
        'litigation_actions',
        'investigation_actions',
    ];

    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            if (!Schema::hasTable($tableName)) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (!Schema::hasColumn($tableName, 'assigned_to_user_id')) {
                    $table->foreignId('assigned_to_user_id')
                        ->nullable()
                        ->after('updated_by')
                        ->constrained('users')
                        ->nullOnDelete();
                }
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            if (!Schema::hasTable($tableName)) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (Schema::hasColumn($tableName, 'assigned_to_user_id')) {
                    $table->dropConstrainedForeignId('assigned_to_user_id');
                }
            });
        }
    }
};
