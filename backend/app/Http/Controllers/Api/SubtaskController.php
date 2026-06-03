<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Subtask\StoreSubtaskRequest;
use App\Http\Requests\Subtask\UpdateSubtaskRequest;
use App\Http\Resources\SubtaskResource;
use App\Models\Subtask;
use App\Models\Task;
use App\Services\SubtaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubtaskController extends Controller
{
    public function __construct(private SubtaskService $subtaskService)
    {
    }

    public function index(Request $request, Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        return ApiResponse::success(
            'Daftar subtask berhasil diambil.',
            SubtaskResource::collection($this->subtaskService->list($task))
        );
    }

    public function store(StoreSubtaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $subtask = $this->subtaskService->create($task, $request->validated());

        return ApiResponse::success(
            'Subtask berhasil dibuat.',
            new SubtaskResource($subtask),
            201
        );
    }

    public function update(UpdateSubtaskRequest $request, Subtask $subtask): JsonResponse
    {
        $this->authorize('update', $subtask);

        $updated = $this->subtaskService->update($subtask, $request->validated());

        return ApiResponse::success(
            'Subtask berhasil diperbarui.',
            new SubtaskResource($updated)
        );
    }

    public function destroy(Request $request, Subtask $subtask): JsonResponse
    {
        $this->authorize('delete', $subtask);

        $this->subtaskService->delete($subtask);

        return ApiResponse::success('Subtask berhasil dihapus.');
    }
}
