<?php

namespace App\Services;

use App\Models\Subtask;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class SubtaskService
{
    public function list(Task $task): Collection
    {
        return $task->subtasks;
    }

    public function create(Task $task, array $data): Subtask
    {
        return $task->subtasks()->create([
            'title' => $data['title'],
            'is_completed' => $data['is_completed'] ?? false,
            'completed_at' => ($data['is_completed'] ?? false) ? now() : null,
            'position' => $data['position'] ?? $this->nextPosition($task),
        ]);
    }

    public function update(Subtask $subtask, array $data): Subtask
    {
        $wasCompleted = $subtask->is_completed;
        $isCompleted = $data['is_completed'] ?? $wasCompleted;

        $subtask->update([
            'title' => $data['title'] ?? $subtask->title,
            'is_completed' => $isCompleted,
            'completed_at' => $isCompleted && ! $wasCompleted
                ? now()
                : (! $isCompleted ? null : $subtask->completed_at),
            'position' => $data['position'] ?? $subtask->position,
        ]);

        return $subtask->fresh();
    }

    public function delete(Subtask $subtask): void
    {
        $subtask->delete();
    }

    private function nextPosition(Task $task): int
    {
        return (int) ($task->subtasks()->max('position') ?? -1) + 1;
    }
}
