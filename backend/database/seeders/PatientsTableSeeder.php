<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Hospital;
use App\Models\Patient;
use Carbon\Carbon;

class PatientsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $hospitals = Hospital::all();

        Patient::insert([
            [
                'full_name' => 'Juan Pérez López',
                'age' => 5,
                'gender' => 'Masculino',
                'birth_date' => Carbon::now()->subYears(5)->format('Y-m-d'),
                'city_id' => $hospitals->where('name', 'Hospital Infantil de México Federico Gómez')->first()->city_id,
                'hospital_id' => $hospitals->where('name', 'Hospital Infantil de México Federico Gómez')->first()->id,
                'tutor_name' => 'María López Martínez',
                'tutor_phone' => '5512345678',
                'registration_date' => Carbon::now()->subMonth()->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'full_name' => 'Ana García Ruiz',
                'age' => 3,
                'gender' => 'Femenino',
                'birth_date' => Carbon::now()->subYears(3)->subMonths(4)->format('Y-m-d'),
                'city_id' => $hospitals->where('name', 'Hospital Civil de Guadalajara - Unidad Pediátrica')->first()->city_id,
                'hospital_id' => $hospitals->where('name', 'Hospital Civil de Guadalajara - Unidad Pediátrica')->first()->id,
                'tutor_name' => 'Carlos García Sánchez',
                'tutor_phone' => '3312345678',
                'registration_date' => Carbon::now()->subDays(15)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'full_name' => 'Miguel Ángel Tun Pech',
                'age' => 7,
                'gender' => 'Masculino',
                'birth_date' => Carbon::now()->subYears(7)->format('Y-m-d'),
                'city_id' => $hospitals->where('name', 'Hospital General "Dr. Agustín O’Horán" - Pediatría')->first()->city_id,
                'hospital_id' => $hospitals->where('name', 'Hospital General "Dr. Agustín O’Horán" - Pediatría')->first()->id,
                'tutor_name' => 'María Pech Canché',
                'tutor_phone' => '9991234567',
                'registration_date' => Carbon::now()->subWeeks(2)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
