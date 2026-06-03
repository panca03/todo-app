<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskCommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'task_id' => $this->task_id,
            'user_id' => $this->user_id,
            'comment' => $this->comment,
            'user' => new UserSummaryResource($this->whenLoaded('user')),
            'mentions' => $this->whenLoaded('mentions', fn () => $this->mentions->map(fn ($m) => [
                'id' => $m->id,
                'mentioned_user' => $m->mentionedUser ? [
                    'id' => $m->mentionedUser->id,
                    'name' => $m->mentionedUser->name,
                ] : null,
            ])),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
