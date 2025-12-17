<?php

namespace App\Http\Requests;

use App\Enums\AssignmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignmentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\Assignment::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'assigned_to_user_id' => ['required', 'exists:users,id'],
            'assigned_by_admin_id' => ['nullable', 'exists:users,id'],
            'status' => ['nullable', Rule::enum(AssignmentStatus::class)],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
