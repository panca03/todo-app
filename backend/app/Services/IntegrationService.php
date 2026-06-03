<?php

namespace App\Services;

use App\Models\Integration;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Collection;

class IntegrationService
{
    public function list(Workspace $workspace): Collection
    {
        return $workspace->integrations()->get();
    }

    public function upsert(Workspace $workspace, array $data): Integration
    {
        return $workspace->integrations()->updateOrCreate(
            ['provider' => $data['provider']],
            [
                'access_token' => $data['access_token'] ?? null,
                'refresh_token' => $data['refresh_token'] ?? null,
                'expires_at' => $data['expires_at'] ?? null,
                'settings' => $data['settings'] ?? null,
                'is_active' => $data['is_active'] ?? true,
            ]
        );
    }

    public function disconnect(Integration $integration): void
    {
        $integration->delete();
    }
}
