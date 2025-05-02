<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use App\Models\Patient;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => [
                'required',
                'string',
                'max:100',
                function ($attribute, $value, $fail) {
                    $exists = Patient::whereRaw('LOWER(full_name) = ?', [strtolower($value)])
                        ->whereDate('birth_date', $this->birth_date)
                        ->exists();
                    
                    if ($exists) {
                        $fail('Ya existe un paciente registrado con este nombre y fecha de nacimiento.');
                    }
                }
            ],
            'gender' => ['required', Rule::in(['Masculino', 'Femenino', 'Otro'])],
            'birth_date' => [
                'required',
                'date',
                'before:today',
                function ($attribute, $value, $fail) {
                    $age = Carbon::parse($value)->age;
                    if ($age > 18) {
                        $fail('El paciente no puede tener más de 18 años para este hospital infantil.');
                    }
                }
            ],
            'city_id' => 'required|exists:cities,id',
            'hospital_id' => 'required|exists:hospitals,id',
            'tutor_name' => 'required|string|max:100',
            'tutor_phone' => 'required|string|max:20|regex:/^[0-9\-\+\(\) ]+$/'
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'El nombre completo es obligatorio.',
            'birth_date.before' => 'La fecha de nacimiento debe ser anterior al día actual.',
            'tutor_phone.regex' => 'El teléfono solo puede contener números y caracteres especiales.',
            'city_id.exists' => 'La ciudad seleccionada no existe.',
            'hospital_id.exists' => 'El hospital seleccionado no existe.',
            'gender.in' => 'El género debe ser Masculino, Femenino u Otro.'
        ];
    }
}