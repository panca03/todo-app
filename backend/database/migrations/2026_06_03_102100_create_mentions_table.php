<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mentions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comment_id')
                ->constrained('task_comments')
                ->cascadeOnDelete();
            $table->foreignId('mentioned_user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['comment_id', 'mentioned_user_id']);
            $table->index('mentioned_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mentions');
    }
};
