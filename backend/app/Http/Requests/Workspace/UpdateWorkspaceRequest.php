<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkspaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:1000'],
            'type' => ['sometimes', 'in:personal,team'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama workspace wajib diisi.',
            'type.in' => 'Tipe workspace harus personal atau team.',
        ];
    }
}
