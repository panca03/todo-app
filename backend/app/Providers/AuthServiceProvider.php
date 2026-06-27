<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Notification;
use App\Models\Task;
use App\Policies\NotificationPolicy;
use App\Policies\TaskPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Task::class => TaskPolicy::class,
        Notification::class => NotificationPolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
