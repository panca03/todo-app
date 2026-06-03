<?php

namespace App\Policies;

use App\Models\Tag;
use App\Models\User;

class TagPolicy
{
    public function view(User $user, Tag $tag): bool
    {
        return $tag->workspace->hasMember($user->id);
    }

    public function update(User $user, Tag $tag): bool
    {
        return $this->view($user, $tag);
    }

    public function delete(User $user, Tag $tag): bool
    {
        $role = $tag->workspace->memberRole($user->id);

        return in_array($role, ['owner', 'admin'], true);
    }
}
