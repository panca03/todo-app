<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\NotificationService;
use Illuminate\Console\Command;

class CheckDueDates extends Command
{
    protected $signature = 'app:check-due-dates';
    protected $description = 'Check for tasks due within 24 hours and create notifications';

    public function handle(NotificationService $notificationService): void
    {
        $this->info('Checking for tasks with upcoming due dates...');
        $notificationService->checkDueDates();
        $this->info('Done.');
    }
}
