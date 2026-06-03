<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function view(User $user, Task $task): bool
    {
        return $task->project->workspace->hasMember($user->id);
    }

    public function update(User $user, Task $task): bool
    {
        return $this->view($user, $task);
    }

    public function delete(User $user, Task $task): bool
    {
        $role = $task->project->workspace->memberRole($user->id);

        return in_array($role, ['owner', 'admin'], true)
            || $task->created_by === $user->id;
    }
}
