<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function view(User $user, Project $project): bool
    {
        return $project->workspace->hasMember($user->id);
    }

    public function create(User $user, \App\Models\Workspace $workspace): bool
    {
        return $workspace->hasMember($user->id);
    }

    public function update(User $user, Project $project): bool
    {
        $role = $project->workspace->memberRole($user->id);

        // Anyone in the workspace can update a project; tighten later if needed.
        return $role !== null;
    }

    public function delete(User $user, Project $project): bool
    {
        $role = $project->workspace->memberRole($user->id);

        return in_array($role, ['owner', 'admin'], true) || $project->created_by === $user->id;
    }
}
