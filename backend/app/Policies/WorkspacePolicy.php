<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workspace;

class WorkspacePolicy
{
    /**
     * Anyone in the workspace can view it.
     */
    public function view(User $user, Workspace $workspace): bool
    {
        return $workspace->hasMember($user->id);
    }

    /**
     * Owner or admin can update workspace metadata.
     */
    public function update(User $user, Workspace $workspace): bool
    {
        $role = $workspace->memberRole($user->id);

        return in_array($role, ['owner', 'admin'], true);
    }

    /**
     * Only the owner can delete the workspace.
     */
    public function delete(User $user, Workspace $workspace): bool
    {
        return $workspace->owner_id === $user->id;
    }

    /**
     * Manage members / invitations.
     */
    public function manageMembers(User $user, Workspace $workspace): bool
    {
        return $this->update($user, $workspace);
    }
}
