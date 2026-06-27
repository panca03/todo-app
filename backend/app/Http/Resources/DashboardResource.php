<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'total_tasks' => $this['total_tasks'],
            'completed_tasks' => $this['completed_tasks'],
            'pending_tasks' => $this['pending_tasks'],
            'overdue_tasks' => $this['overdue_tasks'],
        ];
    }
}
