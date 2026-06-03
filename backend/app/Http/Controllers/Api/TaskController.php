<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Task\ReorderTaskRequest;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(private TaskService $taskService)
    {
    }

    public function index(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $tasks = $this->taskService->list($project, [
            'status' => $request->query('status'),
            'priority' => $request->query('priority'),
            'search' => $request->query('search'),
            'assignee_id' => $request->query('assignee_id'),
        ]);

        return ApiResponse::success(
            'Daftar task berhasil diambil.',
            TaskResource::collection($tasks)
        );
    }

    public function store(StoreTaskRequest $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $task = $this->taskService->create($project, $request->user(), $request->validated());

        return ApiResponse::success(
            'Task berhasil dibuat.',
            new TaskResource($task),
            201
        );
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        $task->load(['assignees', 'tags', 'subtasks', 'creator:id,name,avatar']);

        return ApiResponse::success(
            'Detail task berhasil diambil.',
            new TaskResource($task)
        );
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $updated = $this->taskService->update($task, $request->user(), $request->validated());

        return ApiResponse::success(
            'Task berhasil diperbarui.',
            new TaskResource($updated)
        );
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $this->taskService->delete($task, $request->user());

        return ApiResponse::success('Task berhasil dihapus.');
    }

    public function reorder(ReorderTaskRequest $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $this->taskService->reorder($project, $request->validated()['task_ids']);

        return ApiResponse::success('Urutan task berhasil diperbarui.');
    }
}
