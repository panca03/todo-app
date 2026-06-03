<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workspaces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['personal', 'team'])->default('personal');
            $table->timestamps();

            $table->index('owner_id');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workspaces');
    }
};
