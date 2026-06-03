<?php

namespace App\Http\Requests\Workspace;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkspaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:1000'],
            'type' => ['nullable', 'in:personal,team'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama workspace wajib diisi.',
            'name.max' => 'Nama workspace maksimal 120 karakter.',
            'type.in' => 'Tipe workspace harus personal atau team.',
        ];
    }
}
