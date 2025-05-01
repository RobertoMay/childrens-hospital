<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:100',
            'age' => 'required|integer|min:0|max:18',
            'gender' => ['required', Rule::in(['Masculino', 'Femenino', 'Otro'])],
            'birth_date' => 'required|date|before:today',
            'city_id' => 'required|exists:cities,id',
            'hospital_id' => 'required|exists:hospitals,id',
            'tutor_name' => 'required|string|max:100',
            'tutor_phone' => 'required|string|max:20|regex:/^[0-9\-\+\(\) ]+$/',
            'registration_date' => 'required|date|after_or_equal:birth_date'
        ];
    }


    public function messages(): array
    {
        return [
            'age.max' => 'La edad máxima permitida es 18 años',
            'birth_date.before' => 'La fecha de nacimiento debe ser anterior al día actual',
            'tutor_phone.regex' => 'El teléfono solo puede contener números y caracteres especiales',
            'city_id.exists' => 'La ciudad seleccionada no existe en nuestros registros',
            'hospital_id.exists' => 'El hospital seleccionado no existe'
        ];
    }


    protected function prepareForValidation(): void
    {
        $this->merge([
            'tutor_phone' => preg_replace('/[^0-9]/', '', $this->tutor_phone),
            'registration_date' => $this->registration_date ?? now()->format('Y-m-d')
        ]);
    }
}
