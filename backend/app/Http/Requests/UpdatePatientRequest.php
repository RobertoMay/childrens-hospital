<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use App\Models\Patient;

class UpdatePatientRequest extends FormRequest
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
                $birthDate = $this->input('birth_date') ?? $this->patient->birth_date;
                
                $exists = Patient::where('full_name', $value)
                    ->where('birth_date', $birthDate)
                    ->where('id', '!=', $this->patient->id)
                    ->exists();
                
                if ($exists) {
                    $fail('Ya existe otro paciente con el mismo nombre y fecha de nacimiento.');
                }
            }
        ],
            'gender' => ['sometimes', Rule::in(['Masculino', 'Femenino', 'Otro'])],
            'birth_date' => [
                'sometimes',
                'date',
                'before:today',
                function ($attribute, $value, $fail) {
                    $age = Carbon::parse($value)->age;
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

    public function messages(): array
    {
        return [
            'birth_date.before' => 'La fecha de nacimiento debe ser anterior al día actual',
            'tutor_phone.regex' => 'El teléfono solo puede contener números y caracteres especiales',
            'city_id.exists' => 'La ciudad seleccionada no existe en nuestros registros',
            'hospital_id.exists' => 'El hospital seleccionado no existe',
            'gender.in' => 'El género debe ser Masculino, Femenino u Otro'
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('tutor_phone')) {
            $this->merge([
                'tutor_phone' => preg_replace('/[^0-9]/', '', $this->tutor_phone)
            ]);
        }
    }
}
