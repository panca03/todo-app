<?php

namespace App\Http\Requests\Comment;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'comment' => ['required', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'comment.required' => 'Komentar wajib diisi.',
            'comment.max' => 'Komentar maksimal 5000 karakter.',
        ];
    }
}
