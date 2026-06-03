<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Workspace\StoreWorkspaceRequest;
use App\Http\Requests\Workspace\UpdateWorkspaceRequest;
use App\Http\Resources\WorkspaceResource;
use App\Models\Workspace;
use App\Services\WorkspaceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    public function __construct(private WorkspaceService $workspaceService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $workspaces = $this->workspaceService->listForUser($request->user());

        return ApiResponse::success(
            'Daftar workspace berhasil diambil.',
            WorkspaceResource::collection($workspaces)
        );
    }

    public function store(StoreWorkspaceRequest $request): JsonResponse
    {
        $workspace = $this->workspaceService->create($request->user(), $request->validated());

        return ApiResponse::success(
            'Workspace berhasil dibuat.',
            new WorkspaceResource($workspace),
            201
        );
    }

    public function show(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        $workspace->loadCount(['projects', 'workspaceMembers as members_count']);

        return ApiResponse::success(
            'Detail workspace berhasil diambil.',
            new WorkspaceResource($workspace)
        );
    }

    public function update(UpdateWorkspaceRequest $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('update', $workspace);

        $updated = $this->workspaceService->update($workspace, $request->user(), $request->validated());

        return ApiResponse::success(
            'Workspace berhasil diperbarui.',
            new WorkspaceResource($updated)
        );
    }

    public function destroy(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('delete', $workspace);

        $this->workspaceService->delete($workspace);

        return ApiResponse::success('Workspace berhasil dihapus.');
    }
}
