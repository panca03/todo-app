<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Todo\StoreTodoRequest;
use App\Http\Requests\Todo\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use App\Services\TodoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function __construct(private TodoService $todoService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $todos = $this->todoService->getAll($request->user(), [
            'status' => $request->query('status'),
            'priority' => $request->query('priority'),
            'search' => $request->query('search'),
        ]);

        return ApiResponse::success(
            'Daftar todo berhasil diambil.',
            TodoResource::collection($todos)
        );
    }

    public function store(StoreTodoRequest $request): JsonResponse
    {
        $todo = $this->todoService->create($request->user(), $request->validated());

        return ApiResponse::success(
            'Todo berhasil dibuat.',
            new TodoResource($todo),
            201
        );
    }

    public function show(Request $request, Todo $todo): JsonResponse
    {
        $this->authorize('view', $todo);

        return ApiResponse::success(
            'Detail todo berhasil diambil.',
            new TodoResource($todo)
        );
    }

    public function update(UpdateTodoRequest $request, Todo $todo): JsonResponse
    {
        $this->authorize('update', $todo);

        $updatedTodo = $this->todoService->update($todo, $request->validated());

        return ApiResponse::success(
            'Todo berhasil diperbarui.',
            new TodoResource($updatedTodo)
        );
    }

    public function destroy(Request $request, Todo $todo): JsonResponse
    {
        $this->authorize('delete', $todo);

        $this->todoService->delete($todo);

        return ApiResponse::success('Todo berhasil dihapus.');
    }
}