<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use App\Models\Patient;

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
            'full_name' => [
                'sometimes',
                'string',
                'max:100',
                function ($attribute, $value, $fail) {
                    if ($this->has('birth_date') || isset($this->patient)) {
                        $birthDate = $this->input('birth_date', $this->patient->birth_date ?? null);
                        
                        $exists = Patient::where('full_name', $value)
                            ->where('birth_date', $birthDate)
                            ->where('id', '!=', $this->route('patient'))
                            ->exists();
                        
                        if ($exists) {
                            $fail('Ya existe otro paciente con este nombre y fecha de nacimiento.');
                        }
                    }
                }
            ],
            'gender' => ['sometimes', Rule::in(['Masculino', 'Femenino', 'Otro'])],
            'birth_date' => [
                'sometimes',
                'date',
                'before:today',
                function ($attribute, $value, $fail) {
                    $age = now()->diffInYears($value);
                    if ($age > 18) {
                        $fail('El paciente no puede tener más de 18 años.');
                    }
                }
            ],
            'city_id' => 'sometimes|exists:cities,id',
            'hospital_id' => 'sometimes|exists:hospitals,id',
            'tutor_name' => 'sometimes|string|max:100',
            'tutor_phone' => 'sometimes|string|max:20|regex:/^[0-9\-\+\(\) ]+$/'
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('tutor_phone')) {
            $this->merge([
                'tutor_phone' => preg_replace('/[^0-9]/', '', $this->tutor_phone)
            ]);
        }
    }
}
