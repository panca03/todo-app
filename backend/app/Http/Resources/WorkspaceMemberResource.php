<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'workspace_id' => $this->workspace_id,
            'user_id' => $this->user_id,
            'role' => $this->role,
            'joined_at' => $this->joined_at?->toDateTimeString(),
            'user' => new UserSummaryResource($this->whenLoaded('user')),
        ];
    }
}
