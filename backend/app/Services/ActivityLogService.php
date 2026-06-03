<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;

/**
 * Centralised writer for the activity_logs table.
 * Use this from any service that mutates a workspace entity
 * so the audit trail stays consistent.
 */
class ActivityLogService
{
    public function log(
        ?int $workspaceId,
        ?User $user,
        string $entityType,
        int $entityId,
        string $action,
        array $metadata = []
    ): ActivityLog {
        return ActivityLog::create([
            'workspace_id' => $workspaceId,
            'user_id' => $user?->id,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'action' => $action,
            'metadata' => $metadata ?: null,
            'created_at' => now(),
        ]);
    }
}
