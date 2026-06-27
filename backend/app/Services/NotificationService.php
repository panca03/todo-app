<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\NotificationCreated;
use App\Models\Notification;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

class NotificationService
{
    public function listForUser($user): Collection
    {
        return Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function unreadCount($user): int
    {
        return Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();
    }

    public function markAsRead($user, int $id): Notification
    {
        $notification = Notification::where('user_id', $user->id)
            ->findOrFail($id);

        $notification->markAsRead();

        return $notification;
    }

    public function markAllAsRead($user): void
    {
        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function create($user, string $type, string $title, string $message): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
        ]);
    }

    public function checkDueDates(): void
    {
        $tasks = Task::with('user')
            ->where('status', 'pending')
            ->where('due_date', '>=', now()->toDateString())
            ->where('due_date', '<=', now()->addDay()->toDateString())
            ->get();

        foreach ($tasks as $task) {
            $existing = Notification::where('user_id', $task->user_id)
                ->where('type', 'due_date_reminder')
                ->whereDate('created_at', today())
                ->exists();

            if (! $existing) {
                $notification = $this->create(
                    $task->user,
                    'due_date_reminder',
                    'Due Date Reminder',
                    "Task \"{$task->title}\" is due within 24 hours."
                );

                NotificationCreated::dispatch($notification);
            }
        }
    }
}
