<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Workspace;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ActivityLogQueryService
{
    public function list(Workspace $workspace, array $filters = []): LengthAwarePaginator
    {
        $query = $workspace->activityLogs()
            ->with('user:id,name,avatar')
            ->orderByDesc('created_at');

        if (! empty($filters['entity_type'])) {
            $query->where('entity_type', $filters['entity_type']);
        }

        if (! empty($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (! empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        return $query->paginate((int) ($filters['per_page'] ?? 30));
    }
}
