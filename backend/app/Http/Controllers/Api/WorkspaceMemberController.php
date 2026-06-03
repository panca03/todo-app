<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Workspace\InviteMemberRequest;
use App\Http\Requests\Workspace\UpdateMemberRoleRequest;
use App\Http\Resources\WorkspaceInvitationResource;
use App\Http\Resources\WorkspaceMemberResource;
use App\Models\Workspace;
use App\Services\WorkspaceMemberService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkspaceMemberController extends Controller
{
    public function __construct(private WorkspaceMemberService $memberService)
    {
    }

    public function index(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        $members = $this->memberService->list($workspace);

        return ApiResponse::success(
            'Daftar member workspace berhasil diambil.',
            WorkspaceMemberResource::collection($members)
        );
    }

    public function invite(InviteMemberRequest $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('manageMembers', $workspace);

        $invitation = $this->memberService->invite($workspace, $request->user(), $request->validated());

        return ApiResponse::success(
            'Undangan berhasil dikirim.',
            new WorkspaceInvitationResource($invitation),
            201
        );
    }

    public function updateRole(
        UpdateMemberRoleRequest $request,
        Workspace $workspace,
        int $userId
    ): JsonResponse {
        $this->authorize('manageMembers', $workspace);

        $member = $this->memberService->updateRole(
            $workspace,
            $userId,
            $request->validated()['role'],
            $request->user()
        );

        return ApiResponse::success(
            'Role member berhasil diperbarui.',
            new WorkspaceMemberResource($member)
        );
    }

    public function remove(Request $request, Workspace $workspace, int $userId): JsonResponse
    {
        $this->authorize('manageMembers', $workspace);

        $this->memberService->remove($workspace, $userId, $request->user());

        return ApiResponse::success('Member berhasil dihapus dari workspace.');
    }

    public function acceptInvitation(Request $request, string $token): JsonResponse
    {
        $member = $this->memberService->accept($token, $request->user());

        return ApiResponse::success(
            'Undangan berhasil diterima.',
            new WorkspaceMemberResource($member),
            201
        );
    }
}
