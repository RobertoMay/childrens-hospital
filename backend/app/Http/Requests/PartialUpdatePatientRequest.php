<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartialUpdatePatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => 'sometimes|string|max:100',
            'age' => 'sometimes|integer|min:0|max:18',
            'gender' => ['sometimes', Rule::in(['Masculino', 'Femenino', 'Otro'])],
            'birth_date' => 'sometimes|date|before:today',
            'city_id' => 'sometimes|exists:cities,id',
            'hospital_id' => 'sometimes|exists:hospitals,id',
            'tutor_name' => 'sometimes|string|max:100',
            'tutor_phone' => 'sometimes|string|max:20|regex:/^[0-9\-\+\(\) ]+$/'
        ];
    }
}
