<?php

namespace App\Http\Requests\Todo;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTodoRequest extends FormRequest
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
            'status' => ['sometimes', 'required', 'in:pending,completed'],
            'priority' => ['sometimes', 'required', 'in:low,medium,high'],
            'due_date' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul todo wajib diisi.',
            'title.max' => 'Judul todo maksimal 255 karakter.',
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status harus pending, atau completed.',
            'priority.in' => 'Priority harus low, medium, atau high.',
            'due_date.date' => 'Due date harus berupa tanggal valid.',
        ];
    }
}