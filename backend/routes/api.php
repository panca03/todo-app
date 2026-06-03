<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IntegrationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SubtaskController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\TaskCommentController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\WorkspaceController;
use App\Http\Controllers\Api\WorkspaceMemberController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Authenticated API
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // -----------------------------------------------------------------
    // Workspaces
    // -----------------------------------------------------------------
    Route::apiResource('workspaces', WorkspaceController::class);

    // Workspace members
    Route::prefix('workspaces/{workspace}')->group(function () {
        Route::get('members', [WorkspaceMemberController::class, 'index']);
        Route::post('members/invite', [WorkspaceMemberController::class, 'invite']);
        Route::patch('members/{userId}/role', [WorkspaceMemberController::class, 'updateRole']);
        Route::delete('members/{userId}', [WorkspaceMemberController::class, 'remove']);

        // Projects scoped to a workspace
        Route::get('projects', [ProjectController::class, 'index']);
        Route::post('projects', [ProjectController::class, 'store']);

        // Tags scoped to a workspace
        Route::get('tags', [TagController::class, 'index']);
        Route::post('tags', [TagController::class, 'store']);

        // Activity logs scoped to a workspace
        Route::get('activity-logs', [ActivityLogController::class, 'index']);

        // Integrations scoped to a workspace
        Route::get('integrations', [IntegrationController::class, 'index']);
        Route::post('integrations', [IntegrationController::class, 'upsert']);
    });

    // Invitation acceptance (token-based)
    Route::post('invitations/{token}/accept', [WorkspaceMemberController::class, 'acceptInvitation']);

    // -----------------------------------------------------------------
    // Projects (direct access)
    // -----------------------------------------------------------------
    Route::get('projects/{project}', [ProjectController::class, 'show']);
    Route::patch('projects/{project}', [ProjectController::class, 'update']);
    Route::delete('projects/{project}', [ProjectController::class, 'destroy']);

    // -----------------------------------------------------------------
    // Tasks scoped under a project
    // -----------------------------------------------------------------
    Route::prefix('projects/{project}')->group(function () {
        Route::get('tasks', [TaskController::class, 'index']);
        Route::post('tasks', [TaskController::class, 'store']);
        Route::post('tasks/reorder', [TaskController::class, 'reorder']);
    });

    // Tasks (direct access)
    Route::get('tasks/{task}', [TaskController::class, 'show']);
    Route::patch('tasks/{task}', [TaskController::class, 'update']);
    Route::delete('tasks/{task}', [TaskController::class, 'destroy']);

    // -----------------------------------------------------------------
    // Subtasks
    // -----------------------------------------------------------------
    Route::prefix('tasks/{task}')->group(function () {
        Route::get('subtasks', [SubtaskController::class, 'index']);
        Route::post('subtasks', [SubtaskController::class, 'store']);

        Route::get('comments', [TaskCommentController::class, 'index']);
        Route::post('comments', [TaskCommentController::class, 'store']);
    });

    Route::patch('subtasks/{subtask}', [SubtaskController::class, 'update']);
    Route::delete('subtasks/{subtask}', [SubtaskController::class, 'destroy']);

    // -----------------------------------------------------------------
    // Task comments (direct access)
    // -----------------------------------------------------------------
    Route::patch('comments/{comment}', [TaskCommentController::class, 'update']);
    Route::delete('comments/{comment}', [TaskCommentController::class, 'destroy']);

    // -----------------------------------------------------------------
    // Tags (direct access)
    // -----------------------------------------------------------------
    Route::patch('tags/{tag}', [TagController::class, 'update']);
    Route::delete('tags/{tag}', [TagController::class, 'destroy']);

    // -----------------------------------------------------------------
    // Integrations (direct access)
    // -----------------------------------------------------------------
    Route::delete('integrations/{integration}', [IntegrationController::class, 'destroy']);

    // -----------------------------------------------------------------
    // Notifications
    // -----------------------------------------------------------------
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::patch('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::delete('/{notification}', [NotificationController::class, 'destroy']);
    });
});
