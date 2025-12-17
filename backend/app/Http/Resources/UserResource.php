<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status?->value,
            'preferred_language' => $this->preferred_language,
            'city' => new CityResource($this->whenLoaded('city')),
            'area' => new AreaResource($this->whenLoaded('area')),
            'roles' => $this->roles->pluck('name'),
        ];
    }
}
