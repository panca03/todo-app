<?php

namespace App\Providers;

use App\Models\Integration;
use App\Models\Notification;
use App\Models\Project;
use App\Models\Subtask;
use App\Models\Tag;
use App\Models\Task;
use App\Models\TaskComment;
use App\Models\Workspace;
use App\Policies\IntegrationPolicy;
use App\Policies\NotificationPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\SubtaskPolicy;
use App\Policies\TagPolicy;
use App\Policies\TaskCommentPolicy;
use App\Policies\TaskPolicy;
use App\Policies\WorkspacePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Workspace::class => WorkspacePolicy::class,
        Project::class => ProjectPolicy::class,
        Task::class => TaskPolicy::class,
        Subtask::class => SubtaskPolicy::class,
        TaskComment::class => TaskCommentPolicy::class,
        Tag::class => TagPolicy::class,
        Notification::class => NotificationPolicy::class,
        Integration::class => IntegrationPolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
