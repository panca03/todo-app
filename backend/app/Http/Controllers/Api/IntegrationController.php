<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Integration\UpsertIntegrationRequest;
use App\Http\Resources\IntegrationResource;
use App\Models\Integration;
use App\Models\Workspace;
use App\Services\IntegrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IntegrationController extends Controller
{
    public function __construct(private IntegrationService $integrationService)
    {
    }

    public function index(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        return ApiResponse::success(
            'Daftar integrasi berhasil diambil.',
            IntegrationResource::collection($this->integrationService->list($workspace))
        );
    }

    public function upsert(UpsertIntegrationRequest $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('update', $workspace);

        $integration = $this->integrationService->upsert($workspace, $request->validated());

        return ApiResponse::success(
            'Integrasi berhasil disimpan.',
            new IntegrationResource($integration)
        );
    }

    public function destroy(Request $request, Integration $integration): JsonResponse
    {
        $this->authorize('delete', $integration);

        $this->integrationService->disconnect($integration);

        return ApiResponse::success('Integrasi berhasil diputus.');
    }
}
