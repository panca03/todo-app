<?php

namespace App\Services;

use App\Models\Project;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    public function __construct(private ActivityLogService $activity)
    {
    }

    public function list(Workspace $workspace): Collection
    {
        return $workspace->projects()
            ->withCount('tasks')
            ->orderBy('name')
            ->get();
    }

    public function create(Workspace $workspace, User $user, array $data): Project
    {
        $project = $workspace->projects()->create([
            'created_by' => $user->id,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'color' => $data['color'] ?? '#6366f1',
        ]);

        $this->activity->log(
            $workspace->id,
            $user,
            'project',
            $project->id,
            'created',
            ['name' => $project->name]
        );

        return $project;
    }

    public function update(Project $project, User $user, array $data): Project
    {
        $project->update([
            'name' => $data['name'] ?? $project->name,
            'description' => array_key_exists('description', $data)
                ? $data['description']
                : $project->description,
            'color' => $data['color'] ?? $project->color,
        ]);

        $this->activity->log(
            $project->workspace_id,
            $user,
            'project',
            $project->id,
            'updated',
            $data
        );

        return $project->fresh();
    }

    public function delete(Project $project, User $user): void
    {
        $workspaceId = $project->workspace_id;
        $projectId = $project->id;

        $project->delete();

        $this->activity->log(
            $workspaceId,
            $user,
            'project',
            $projectId,
            'deleted'
        );
    }
}
