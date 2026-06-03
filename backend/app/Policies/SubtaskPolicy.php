<?php

namespace App\Policies;

use App\Models\Subtask;
use App\Models\User;

class SubtaskPolicy
{
    public function view(User $user, Subtask $subtask): bool
    {
        return $subtask->task->project->workspace->hasMember($user->id);
    }

    public function update(User $user, Subtask $subtask): bool
    {
        return $this->view($user, $subtask);
    }

    public function delete(User $user, Subtask $subtask): bool
    {
        return $this->view($user, $subtask);
    }
}
