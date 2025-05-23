<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'age' => $this->age,
            'gender' => $this->gender,
            'birth_date' => $this->birth_date->format('Y-m-d'),
            'city' => $this->city->name ?? null,
            'hospital' => $this->hospital->name ?? null,
            'tutor_name' => $this->tutor_name,
            'tutor_phone' => $this->tutor_phone,
            'registration_date' => $this->registration_date->format('Y-m-d'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s')
        ];
    }
}
