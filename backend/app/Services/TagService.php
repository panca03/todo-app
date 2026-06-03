<?php

namespace App\Services;

use App\Models\Tag;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Collection;

class TagService
{
    public function list(Workspace $workspace): Collection
    {
        return $workspace->tags()->orderBy('name')->get();
    }

    public function create(Workspace $workspace, array $data): Tag
    {
        return $workspace->tags()->create([
            'name' => $data['name'],
            'color' => $data['color'] ?? '#94a3b8',
        ]);
    }

    public function update(Tag $tag, array $data): Tag
    {
        $tag->update([
            'name' => $data['name'] ?? $tag->name,
            'color' => $data['color'] ?? $tag->color,
        ]);

        return $tag->fresh();
    }

    public function delete(Tag $tag): void
    {
        $tag->delete();
    }
}
