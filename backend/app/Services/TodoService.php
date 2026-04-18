<?php

namespace App\Services;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class TodoService
{
    public function getAll(User $user, array $filters = []): Collection
    {
        $query = $user->todos()->latest();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->get();
    }

    public function create(User $user, array $data): Todo
    {
        return $user->todos()->create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'pending',
            'priority' => $data['priority'] ?? 'low', 
            'due_date' => $data['due_date'] ?? null,
        ]);
    }

    public function update(Todo $todo, array $data): Todo
    {
        $todo->update([
            'title' => $data['title'] ?? $todo->title,
            'description' => array_key_exists('description', $data) ? $data['description'] : $todo->description,
            'status' => $data['status'] ?? $todo->status,
            'priority' => $data['priority'] ?? $todo->priority,
            'due_date' => array_key_exists('due_date', $data) ? $data['due_date'] : $todo->due_date,
        ]);

        return $todo->fresh();
    }

    public function delete(Todo $todo): void
    {
        $todo->delete();
    }
}