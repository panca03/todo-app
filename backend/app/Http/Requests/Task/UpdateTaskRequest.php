<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', 'in:todo,in_progress,completed'],
            'priority' => ['sometimes', 'required', 'in:critical,important,optional'],
            'start_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date'],
            'position' => ['sometimes', 'integer', 'min:0'],
            'assignee_ids' => ['sometimes', 'array'],
            'assignee_ids.*' => ['integer', 'exists:users,id'],
            'tag_ids' => ['sometimes', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul task wajib diisi.',
            'status.in' => 'Status harus todo, in_progress, atau completed.',
            'priority.in' => 'Priority harus critical, important, atau optional.',
        ];
    }
}
