<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

/**
 * Legacy "todos" table is replaced by the new "tasks" table
 * scoped to projects/workspaces. Drop it before introducing
 * the new schema to avoid ambiguity.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('todos');
    }

    public function down(): void
    {
        // No-op: the legacy "todos" table is intentionally retired.
    }
};
