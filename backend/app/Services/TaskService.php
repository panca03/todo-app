<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TaskService
{
    public function listForUser($user, array $filters = [])
    {
        $query = Task::where('user_id', $user->id);

        if (! empty($filters['search'])) {
            $query->where('title', 'like', '%' . $filters['search'] . '%');
        }

        if (! empty($filters['status'])) {
            $query->status($filters['status']);
        }

        if (! empty($filters['priority'])) {
            $query->priority($filters['priority']);
        }

        return $query->orderBy('due_date')->orderBy('created_at', 'desc')->get();
    }

    public function create($user, array $data): Task
    {
        $data['user_id'] = $user->id;

        return Task::create($data);
    }

    public function find($user, int $id): Task
    {
        $task = Task::find($id);

        if (! $task || $task->user_id !== $user->id) {
            throw (new ModelNotFoundException)->setModel(Task::class, $id);
        }

        return $task;
    }

    public function update($user, int $id, array $data): Task
    {
        $task = $this->find($user, $id);
        $task->update($data);

        return $task;
    }

    public function delete($user, int $id): void
    {
        $task = $this->find($user, $id);
        $task->delete();
    }

    public function markAsCompleted($user, int $id): Task
    {
        $task = $this->find($user, $id);

        $task->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return $task;
    }
}
