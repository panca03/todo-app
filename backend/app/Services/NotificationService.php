<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationService
{
    public function list(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = $user->notifications()->latest();

        if (isset($filters['is_read'])) {
            $query->where('is_read', (bool) $filters['is_read']);
        }

        if (! empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query->paginate((int) ($filters['per_page'] ?? 20));
    }

    public function markAsRead(Notification $notification): Notification
    {
        $notification->markAsRead();

        return $notification->fresh();
    }

    public function markAllAsRead(User $user): int
    {
        return $user->notifications()
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function delete(Notification $notification): void
    {
        $notification->delete();
    }

    public function unreadCount(User $user): int
    {
        return (int) $user->notifications()->where('is_read', false)->count();
    }
}
