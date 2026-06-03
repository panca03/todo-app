<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Models\Workspace;
use App\Services\ActivityLogQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function __construct(private ActivityLogQueryService $service)
    {
    }

    public function index(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        $logs = $this->service->list($workspace, [
            'entity_type' => $request->query('entity_type'),
            'action' => $request->query('action'),
            'user_id' => $request->query('user_id'),
            'per_page' => $request->query('per_page', 30),
        ]);

        return ApiResponse::success(
            'Activity log berhasil diambil.',
            ActivityLogResource::collection($logs),
            200,
            [
                'pagination' => [
                    'current_page' => $logs->currentPage(),
                    'last_page' => $logs->lastPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                ],
            ]
        );
    }
}
