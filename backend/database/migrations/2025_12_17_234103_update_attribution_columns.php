<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('archives', function (Blueprint $table) {
            if (!Schema::hasColumn('archives', 'created_by')) {
                $table->foreignId('created_by')->nullable()->after('extracted_text')->constrained('users')->nullOnDelete();
            }

            if (!Schema::hasColumn('archives', 'updated_by')) {
                $table->foreignId('updated_by')->nullable()->after('created_by')->constrained('users')->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('archives', function (Blueprint $table) {
            if (Schema::hasColumn('archives', 'updated_by')) {
                $table->dropConstrainedForeignId('updated_by');
            }

            if (Schema::hasColumn('archives', 'created_by')) {
                $table->dropConstrainedForeignId('created_by');
            }
        });

        foreach ($this->assignmentTables as $tableName) {
            if (!Schema::hasTable($tableName)) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                if (Schema::hasColumn($tableName, 'assigned_by_user_id')) {
                    $table->dropConstrainedForeignId('assigned_by_user_id');
                }
            });
        }
    }
};
