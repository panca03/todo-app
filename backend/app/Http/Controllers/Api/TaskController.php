<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController
{
    public function __construct(
        protected TaskService $taskService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status', 'priority']);
        $tasks = $this->taskService->listForUser($request->user(), $filters);

        return ApiResponse::success('Tasks retrieved.', TaskResource::collection($tasks));
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->taskService->create($request->user(), $request->validated());

        return ApiResponse::success('Task created.', new TaskResource($task), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $task = $this->taskService->find($request->user(), $id);

        return ApiResponse::success('Task retrieved.', new TaskResource($task));
    }

    public function update(Request $request, int $id, UpdateTaskRequest $updateRequest): JsonResponse
    {
        $task = $this->taskService->update($request->user(), $id, $updateRequest->validated());

        return ApiResponse::success('Task updated.', new TaskResource($task));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->taskService->delete($request->user(), $id);

        return ApiResponse::success('Task deleted.');
    }

    public function complete(Request $request, int $id): JsonResponse
    {
        $task = $this->taskService->markAsCompleted($request->user(), $id);

        return ApiResponse::success('Task marked as completed.', new TaskResource($task));
    }
}
