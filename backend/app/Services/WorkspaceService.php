<?php

namespace App\Services;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class WorkspaceService
{
    public function __construct(private ActivityLogService $activity)
    {
    }

    public function listForUser(User $user): Collection
    {
        return $user->workspaces()
            ->withCount(['projects', 'workspaceMembers as members_count'])
            ->orderBy('name')
            ->get();
    }

    public function create(User $user, array $data): Workspace
    {
        return DB::transaction(function () use ($user, $data) {
            $workspace = Workspace::create([
                'owner_id' => $user->id,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'type' => $data['type'] ?? 'team',
            ]);

            $workspace->workspaceMembers()->create([
                'user_id' => $user->id,
                'role' => 'owner',
                'joined_at' => now(),
            ]);

            $this->activity->log(
                $workspace->id,
                $user,
                'workspace',
                $workspace->id,
                'created',
                ['name' => $workspace->name]
            );

            return $workspace->fresh();
        });
    }

    public function update(Workspace $workspace, User $user, array $data): Workspace
    {
        $workspace->update([
            'name' => $data['name'] ?? $workspace->name,
            'description' => array_key_exists('description', $data)
                ? $data['description']
                : $workspace->description,
            'type' => $data['type'] ?? $workspace->type,
        ]);

        $this->activity->log(
            $workspace->id,
            $user,
            'workspace',
            $workspace->id,
            'updated',
            $data
        );

        return $workspace->fresh();
    }

    public function delete(Workspace $workspace): void
    {
        $workspace->delete();
    }
}
