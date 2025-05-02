<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Hospital;
use App\Models\City;

class HospitalsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cdmx = City::where('name', 'Ciudad de México')->first()->id;
        $gdl = City::where('name', 'Guadalajara')->first()->id;
        $merida = City::where('name', 'Mérida')->first()->id;
        $uman = City::where('name', 'Umán')->first()->id;
        $cancun = City::where('name', 'Cancún')->first()->id;
        $puebla = City::where('name', 'Puebla')->first()->id;
        $tijuana = City::where('name', 'Tijuana')->first()->id;
        $monterrey = City::where('name', 'Monterrey')->first()->id;
        
        Hospital::insert([
            [
                'name' => 'Hospital Infantil de México Federico Gómez',
                'city_id' => $cdmx,
            ],
            [
                'name' => 'Centro Médico Nacional Siglo XXI - Pediatría',
                'city_id' => $cdmx,
            ],
            [
                'name' => 'Hospital Civil de Guadalajara - Unidad Pediátrica',
                'city_id' => $gdl,
            ],
            [
                'name' => 'Hospital General "Dr. Agustín O’Horán" - Pediatría',
                'city_id' => $merida,
            ],
            [
                'name' => 'Clínica Pediátrica del Mayab',
                'city_id' => $merida,
            ],
            [
                'name' => 'Hospital Comunitario de Umán',
                'city_id' => $uman,
            ],
            [
                'name' => 'Hospital General de Cancún - Área Infantil',
                'city_id' => $cancun,
            ],
            [
                'name' => 'Hospital Infantil de Tijuana',
                'city_id' => $tijuana,
            ],
            [
                'name' => 'Hospital del Niño Poblano',
                'city_id' => $puebla,
            ],
            [
                'name' => 'Hospital Universitario - Área Pediátrica',
                'city_id' => $monterrey,
            ],
        ]);
    }
}
