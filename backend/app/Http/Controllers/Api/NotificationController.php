<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $notificationService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $notifications = $this->notificationService->list($request->user(), [
            'is_read' => $request->has('is_read')
                ? filter_var($request->query('is_read'), FILTER_VALIDATE_BOOLEAN)
                : null,
            'type' => $request->query('type'),
            'per_page' => $request->query('per_page', 20),
        ]);

        return ApiResponse::success(
            'Daftar notifikasi berhasil diambil.',
            NotificationResource::collection($notifications),
            200,
            [
                'pagination' => [
                    'current_page' => $notifications->currentPage(),
                    'last_page' => $notifications->lastPage(),
                    'per_page' => $notifications->perPage(),
                    'total' => $notifications->total(),
                ],
            ]
        );
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return ApiResponse::success(
            'Jumlah notifikasi belum dibaca.',
            ['unread_count' => $this->notificationService->unreadCount($request->user())]
        );
    }

    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        $this->authorize('update', $notification);

        $updated = $this->notificationService->markAsRead($notification);

        return ApiResponse::success(
            'Notifikasi ditandai sebagai dibaca.',
            new NotificationResource($updated)
        );
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $count = $this->notificationService->markAllAsRead($request->user());

        return ApiResponse::success(
            'Semua notifikasi ditandai sebagai dibaca.',
            ['updated_count' => $count]
        );
    }

    public function destroy(Request $request, Notification $notification): JsonResponse
    {
        $this->authorize('delete', $notification);

        $this->notificationService->delete($notification);

        return ApiResponse::success('Notifikasi berhasil dihapus.');
    }
}
