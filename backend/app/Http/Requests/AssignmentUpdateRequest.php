<?php

namespace App\Http\Requests;

use App\Enums\AssignmentStatus;
use Illuminate\Foundation\Http\FormRequest;

class AssignmentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', 'required', 'in:' . implode(',', array_column(AssignmentStatus::cases(), 'value'))],
            'due_date' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
