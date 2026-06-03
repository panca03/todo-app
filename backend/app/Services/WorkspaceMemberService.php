<?php

namespace App\Services;

use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceInvitation;
use App\Models\WorkspaceMember;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class WorkspaceMemberService
{
    public function __construct(private ActivityLogService $activity)
    {
    }

    public function list(Workspace $workspace): Collection
    {
        return $workspace->workspaceMembers()
            ->with('user')
            ->orderBy('role')
            ->get();
    }

    public function updateRole(Workspace $workspace, int $userId, string $role, User $actor): WorkspaceMember
    {
        $member = $workspace->workspaceMembers()
            ->where('user_id', $userId)
            ->firstOrFail();

        if ($member->role === 'owner') {
            throw ValidationException::withMessages([
                'role' => ['Role pemilik tidak bisa diubah.'],
            ]);
        }

        $member->update(['role' => $role]);

        $this->activity->log(
            $workspace->id,
            $actor,
            'workspace_member',
            $member->id,
            'role_updated',
            ['user_id' => $userId, 'new_role' => $role]
        );

        return $member->fresh('user');
    }

    public function remove(Workspace $workspace, int $userId, User $actor): void
    {
        $member = $workspace->workspaceMembers()
            ->where('user_id', $userId)
            ->firstOrFail();

        if ($member->role === 'owner') {
            throw ValidationException::withMessages([
                'user_id' => ['Pemilik workspace tidak bisa dihapus.'],
            ]);
        }

        $member->delete();

        $this->activity->log(
            $workspace->id,
            $actor,
            'workspace_member',
            $userId,
            'removed'
        );
    }

    public function invite(Workspace $workspace, User $inviter, array $data): WorkspaceInvitation
    {
        // Already a member?
        $existingUser = User::where('email', $data['email'])->first();
        if ($existingUser && $workspace->hasMember($existingUser->id)) {
            throw ValidationException::withMessages([
                'email' => ['User sudah menjadi member workspace ini.'],
            ]);
        }

        // Reuse a pending invitation if it exists.
        $invitation = $workspace->invitations()
            ->where('email', $data['email'])
            ->whereNull('accepted_at')
            ->first();

        if ($invitation) {
            $invitation->update([
                'role' => $data['role'] ?? $invitation->role,
                'token' => Str::random(48),
                'expires_at' => now()->addDays(7),
                'invited_by' => $inviter->id,
            ]);
        } else {
            $invitation = $workspace->invitations()->create([
                'invited_by' => $inviter->id,
                'email' => $data['email'],
                'role' => $data['role'] ?? 'member',
                'token' => Str::random(48),
                'expires_at' => now()->addDays(7),
            ]);
        }

        $this->activity->log(
            $workspace->id,
            $inviter,
            'workspace_invitation',
            $invitation->id,
            'sent',
            ['email' => $invitation->email, 'role' => $invitation->role]
        );

        // If recipient already exists, send a notification.
        if ($existingUser) {
            $existingUser->notifications()->create([
                'type' => 'workspace_invitation',
                'title' => "Undangan ke workspace {$workspace->name}",
                'message' => "Anda diundang sebagai {$invitation->role}.",
                'data' => [
                    'workspace_id' => $workspace->id,
                    'invitation_id' => $invitation->id,
                    'token' => $invitation->token,
                ],
            ]);
        }

        return $invitation;
    }

    public function accept(string $token, User $user): WorkspaceMember
    {
        return DB::transaction(function () use ($token, $user) {
            $invitation = WorkspaceInvitation::where('token', $token)->firstOrFail();

            if ($invitation->isAccepted()) {
                throw ValidationException::withMessages([
                    'token' => ['Undangan ini sudah pernah diterima.'],
                ]);
            }

            if ($invitation->isExpired()) {
                throw ValidationException::withMessages([
                    'token' => ['Undangan sudah kadaluarsa.'],
                ]);
            }

            if (strcasecmp($invitation->email, $user->email) !== 0) {
                throw ValidationException::withMessages([
                    'token' => ['Undangan ini tidak ditujukan untuk akun Anda.'],
                ]);
            }

            $workspace = $invitation->workspace;

            if ($workspace->hasMember($user->id)) {
                throw ValidationException::withMessages([
                    'token' => ['Anda sudah menjadi member workspace ini.'],
                ]);
            }

            $member = $workspace->workspaceMembers()->create([
                'user_id' => $user->id,
                'role' => $invitation->role,
                'joined_at' => now(),
            ]);

            $invitation->update(['accepted_at' => now()]);

            $this->activity->log(
                $workspace->id,
                $user,
                'workspace_member',
                $member->id,
                'joined',
                ['role' => $member->role]
            );

            return $member->fresh('user');
        });
    }
}
