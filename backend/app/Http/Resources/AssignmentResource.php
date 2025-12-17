<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status?->value ?? $this->status,
            'due_date' => $this->due_date,
            'order' => new OrderResource($this->whenLoaded('order')),
            'assignee' => new UserResource($this->whenLoaded('assignee')),
            'assigner' => new UserResource($this->whenLoaded('assigner')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
