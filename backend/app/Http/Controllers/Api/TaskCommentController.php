<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Comment\StoreCommentRequest;
use App\Http\Requests\Comment\UpdateCommentRequest;
use App\Http\Resources\TaskCommentResource;
use App\Models\Task;
use App\Models\TaskComment;
use App\Services\CommentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    public function __construct(private CommentService $commentService)
    {
    }

    public function index(Request $request, Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        $comments = $this->commentService->list($task);

        return ApiResponse::success(
            'Daftar komentar berhasil diambil.',
            TaskCommentResource::collection($comments)
        );
    }

    public function store(StoreCommentRequest $request, Task $task): JsonResponse
    {
        $this->authorize('view', $task);

        $comment = $this->commentService->create($task, $request->user(), $request->validated());

        return ApiResponse::success(
            'Komentar berhasil ditambahkan.',
            new TaskCommentResource($comment),
            201
        );
    }

    public function update(UpdateCommentRequest $request, TaskComment $comment): JsonResponse
    {
        $this->authorize('update', $comment);

        $updated = $this->commentService->update($comment, $request->validated());

        return ApiResponse::success(
            'Komentar berhasil diperbarui.',
            new TaskCommentResource($updated)
        );
    }

    public function destroy(Request $request, TaskComment $comment): JsonResponse
    {
        $this->authorize('delete', $comment);

        $this->commentService->delete($comment);

        return ApiResponse::success('Komentar berhasil dihapus.');
    }
}
