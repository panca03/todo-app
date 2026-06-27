<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Task;

class DashboardService
{
    public function stats($user): array
    {
        $total = Task::where('user_id', $user->id)->count();
        $completed = Task::where('user_id', $user->id)->where('status', 'completed')->count();
        $pending = Task::where('user_id', $user->id)->where('status', 'pending')->count();
        $overdue = Task::where('user_id', $user->id)
            ->where('status', 'pending')
            ->where('due_date', '<', now()->toDateString())
            ->count();

        return [
            'total_tasks' => $total,
            'completed_tasks' => $completed,
            'pending_tasks' => $pending,
            'overdue_tasks' => $overdue,
        ];
    }
}
