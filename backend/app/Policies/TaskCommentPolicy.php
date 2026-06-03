<?php

namespace App\Policies;

use App\Models\TaskComment;
use App\Models\User;

class TaskCommentPolicy
{
    public function view(User $user, TaskComment $comment): bool
    {
        return $comment->task->project->workspace->hasMember($user->id);
    }

    public function update(User $user, TaskComment $comment): bool
    {
        // Only the author can edit their comment.
        return $comment->user_id === $user->id;
    }

    public function delete(User $user, TaskComment $comment): bool
    {
        $role = $comment->task->project->workspace->memberRole($user->id);

        return $comment->user_id === $user->id
            || in_array($role, ['owner', 'admin'], true);
    }
}
