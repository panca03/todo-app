<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TaskService
{
    public function __construct(private ActivityLogService $activity)
    {
    }

    public function list(Project $project, array $filters = []): Collection
    {
        $query = $project->tasks()
            ->with(['assignees:id,name,avatar', 'tags:id,name,color', 'subtasks'])
            ->status($filters['status'] ?? null)
            ->priority($filters['priority'] ?? null)
            ->orderBy('position')
            ->orderByDesc('created_at');

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['assignee_id'])) {
            $query->whereHas('assignees', fn ($q) => $q->where('users.id', $filters['assignee_id']));
        }

        return $query->get();
    }

    public function create(Project $project, User $user, array $data): Task
    {
        return DB::transaction(function () use ($project, $user, $data) {
            $task = $project->tasks()->create([
                'created_by' => $user->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? 'todo',
                'priority' => $data['priority'] ?? 'optional',
                'start_date' => $data['start_date'] ?? null,
                'due_date' => $data['due_date'] ?? null,
                'position' => $data['position'] ?? $this->nextPosition($project),
            ]);

            if (! empty($data['assignee_ids'])) {
                $this->syncAssignees($task, $user, $data['assignee_ids']);
            }

            if (! empty($data['tag_ids'])) {
                $task->tags()->sync($data['tag_ids']);
            }

            $this->activity->log(
                $project->workspace_id,
                $user,
                'task',
                $task->id,
                'created',
                ['title' => $task->title]
            );

            return $task->load(['assignees', 'tags', 'subtasks']);
        });
    }

    public function update(Task $task, User $user, array $data): Task
    {
        return DB::transaction(function () use ($task, $user, $data) {
            $oldStatus = $task->status;

            $task->update([
                'title' => $data['title'] ?? $task->title,
                'description' => array_key_exists('description', $data) ? $data['description'] : $task->description,
                'status' => $data['status'] ?? $task->status,
                'priority' => $data['priority'] ?? $task->priority,
                'start_date' => array_key_exists('start_date', $data) ? $data['start_date'] : $task->start_date,
                'due_date' => array_key_exists('due_date', $data) ? $data['due_date'] : $task->due_date,
                'position' => $data['position'] ?? $task->position,
                'completed_at' => ($data['status'] ?? null) === 'completed' && $oldStatus !== 'completed'
                    ? now()
                    : (($data['status'] ?? null) && $data['status'] !== 'completed' ? null : $task->completed_at),
            ]);

            if (array_key_exists('assignee_ids', $data)) {
                $this->syncAssignees($task, $user, $data['assignee_ids'] ?? []);
            }

            if (array_key_exists('tag_ids', $data)) {
                $task->tags()->sync($data['tag_ids'] ?? []);
            }

            $this->activity->log(
                $task->project->workspace_id,
                $user,
                'task',
                $task->id,
                $oldStatus !== $task->status ? 'status_changed' : 'updated',
                $oldStatus !== $task->status
                    ? ['old_status' => $oldStatus, 'new_status' => $task->status]
                    : $data
            );

            return $task->fresh(['assignees', 'tags', 'subtasks']);
        });
    }

    public function delete(Task $task, User $user): void
    {
        $workspaceId = $task->project->workspace_id;
        $taskId = $task->id;

        $task->delete();

        $this->activity->log(
            $workspaceId,
            $user,
            'task',
            $taskId,
            'deleted'
        );
    }

    public function reorder(Project $project, array $orderedIds): void
    {
        DB::transaction(function () use ($project, $orderedIds) {
            foreach ($orderedIds as $position => $id) {
                $project->tasks()
                    ->where('id', $id)
                    ->update(['position' => $position]);
            }
        });
    }

    // -----------------------------------------------------------------
    // Internals
    // -----------------------------------------------------------------

    private function nextPosition(Project $project): int
    {
        return (int) ($project->tasks()->max('position') ?? -1) + 1;
    }

    /**
     * Sync assignees and emit task_assigned notifications for newly added users.
     */
    private function syncAssignees(Task $task, User $actor, array $userIds): void
    {
        $previous = $task->assignees()->pluck('users.id')->all();
        $pivotData = collect($userIds)
            ->mapWithKeys(fn ($id) => [$id => ['assigned_by' => $actor->id]])
            ->all();

        $task->assignees()->sync($pivotData);

        $newlyAssigned = array_diff($userIds, $previous);
        foreach ($newlyAssigned as $userId) {
            if ($userId === $actor->id) {
                continue;
            }

            \App\Models\Notification::create([
                'user_id' => $userId,
                'type' => 'task_assigned',
                'title' => "Anda di-assign ke task: {$task->title}",
                'message' => $actor->name . ' menugaskan task ini kepada Anda.',
                'data' => [
                    'task_id' => $task->id,
                    'project_id' => $task->project_id,
                ],
            ]);
        }
    }
}
