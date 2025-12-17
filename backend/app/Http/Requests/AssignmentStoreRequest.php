<?php

namespace App\Http\Requests;

use App\Enums\AssignmentStatus;
use Illuminate\Foundation\Http\FormRequest;

class AssignmentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'assigned_to_user_id' => ['required', 'exists:users,id'],
            'assigned_by_user_id' => ['required', 'exists:users,id'],
            'status' => ['required', 'in:' . implode(',', array_column(AssignmentStatus::cases(), 'value'))],
            'due_date' => ['nullable', 'date'],
        ];
    }
}
