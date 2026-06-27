<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Resources\DashboardResource;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function stats(Request $request): JsonResponse
    {
        $stats = $this->dashboardService->stats($request->user());

        return ApiResponse::success('Dashboard stats retrieved.', new DashboardResource($stats));
    }
}
