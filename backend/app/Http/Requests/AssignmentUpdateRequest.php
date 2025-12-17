<?php

namespace App\Http\Requests;

use App\Enums\AssignmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignmentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('assignment')) ?? false;
    }

    public function rules(): array
    {
        return [
            'assigned_to_user_id' => ['sometimes', 'required', 'exists:users,id'],
            'status' => ['sometimes', Rule::enum(AssignmentStatus::class)],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
