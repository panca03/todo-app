<?php

namespace App\Services;

use App\Models\Mention;
use App\Models\Task;
use App\Models\TaskComment;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CommentService
{
    public function list(Task $task): Collection
    {
        return $task->comments()->with(['user:id,name,avatar', 'mentions.mentionedUser:id,name'])->get();
    }

    public function create(Task $task, User $user, array $data): TaskComment
    {
        return DB::transaction(function () use ($task, $user, $data) {
            $comment = $task->comments()->create([
                'user_id' => $user->id,
                'comment' => $data['comment'],
            ]);

            $mentionedUserIds = $this->resolveMentions($task, $data['comment']);
            foreach ($mentionedUserIds as $mentionedUserId) {
                Mention::create([
                    'comment_id' => $comment->id,
                    'mentioned_user_id' => $mentionedUserId,
                ]);

                if ($mentionedUserId !== $user->id) {
                    \App\Models\Notification::create([
                        'user_id' => $mentionedUserId,
                        'type' => 'mention',
                        'title' => "{$user->name} menyebut Anda di sebuah komentar",
                        'message' => str($comment->comment)->limit(120),
                        'data' => [
                            'task_id' => $task->id,
                            'comment_id' => $comment->id,
                        ],
                    ]);
                }
            }

            return $comment->load(['user', 'mentions.mentionedUser']);
        });
    }

    public function update(TaskComment $comment, array $data): TaskComment
    {
        $comment->update(['comment' => $data['comment'] ?? $comment->comment]);

        return $comment->fresh(['user', 'mentions.mentionedUser']);
    }

    public function delete(TaskComment $comment): void
    {
        $comment->delete();
    }

    /**
     * Resolve "@username" tokens against workspace members.
     * The token grammar is "@" + 1..50 chars of [A-Za-z0-9_.-].
     */
    private function resolveMentions(Task $task, string $body): array
    {
        preg_match_all('/@([A-Za-z0-9_.\-]{1,50})/', $body, $matches);
        $handles = array_unique($matches[1] ?? []);

        if (empty($handles)) {
            return [];
        }

        $workspaceId = $task->project->workspace_id;

        // Match against members' names (case-insensitive). Names can have
        // spaces, so we collapse handle to lowercase name without spaces too.
        $members = User::query()
            ->whereIn('id', function ($q) use ($workspaceId) {
                $q->select('user_id')
                    ->from('workspace_members')
                    ->where('workspace_id', $workspaceId);
            })
            ->get(['id', 'name', 'email']);

        $resolved = [];
        foreach ($members as $member) {
            $collapsed = strtolower(str_replace(' ', '', $member->name));
            foreach ($handles as $handle) {
                if (strtolower($handle) === $collapsed
                    || strtolower($handle) === strtolower(strstr($member->email, '@', true))
                ) {
                    $resolved[] = $member->id;
                }
            }
        }

        return array_values(array_unique($resolved));
    }
}
