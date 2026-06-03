<?php

namespace App\Policies;

use App\Models\Integration;
use App\Models\User;

class IntegrationPolicy
{
    public function view(User $user, Integration $integration): bool
    {
        return $integration->workspace->hasMember($user->id);
    }

    public function update(User $user, Integration $integration): bool
    {
        $role = $integration->workspace->memberRole($user->id);

        return in_array($role, ['owner', 'admin'], true);
    }

    public function delete(User $user, Integration $integration): bool
    {
        return $this->update($user, $integration);
    }
}
