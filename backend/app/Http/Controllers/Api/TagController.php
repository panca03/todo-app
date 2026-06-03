<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tag\StoreTagRequest;
use App\Http\Requests\Tag\UpdateTagRequest;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use App\Models\Workspace;
use App\Services\TagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function __construct(private TagService $tagService)
    {
    }

    public function index(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        return ApiResponse::success(
            'Daftar tag berhasil diambil.',
            TagResource::collection($this->tagService->list($workspace))
        );
    }

    public function store(StoreTagRequest $request, Workspace $workspace): JsonResponse
    {
        $this->authorize('view', $workspace);

        $tag = $this->tagService->create($workspace, $request->validated());

        return ApiResponse::success(
            'Tag berhasil dibuat.',
            new TagResource($tag),
            201
        );
    }

    public function update(UpdateTagRequest $request, Tag $tag): JsonResponse
    {
        $this->authorize('update', $tag);

        $updated = $this->tagService->update($tag, $request->validated());

        return ApiResponse::success(
            'Tag berhasil diperbarui.',
            new TagResource($updated)
        );
    }

    public function destroy(Request $request, Tag $tag): JsonResponse
    {
        $this->authorize('delete', $tag);

        $this->tagService->delete($tag);

        return ApiResponse::success('Tag berhasil dihapus.');
    }
}
