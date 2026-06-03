<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\Workspace;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(private ProjectService $projectService)
    {
    }

    public function index(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        $projects = $this->projectService->list($workspace);

        return ApiResponse::success(
            'Daftar project berhasil diambil.',
            ProjectResource::collection($projects)
        );
    }

    public function store(StoreProjectRequest $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('create', [Project::class, $workspace]);

        $project = $this->projectService->create($workspace, $request->user(), $request->validated());

        return ApiResponse::success(
            'Project berhasil dibuat.',
            new ProjectResource($project),
            201
        );
    }

    public function show(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $project->loadCount('tasks');

        return ApiResponse::success(
            'Detail project berhasil diambil.',
            new ProjectResource($project)
        );
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $updated = $this->projectService->update($project, $request->user(), $request->validated());

        return ApiResponse::success(
            'Project berhasil diperbarui.',
            new ProjectResource($updated)
        );
    }

    public function destroy(Request $request, Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $this->projectService->delete($project, $request->user());

        return ApiResponse::success('Project berhasil dihapus.');
    }
}
