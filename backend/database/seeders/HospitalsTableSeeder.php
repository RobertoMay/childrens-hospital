<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HospitalsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cdmx = City::where('name', 'Ciudad de México')->first()->id;
        $gdl = City::where('name', 'Guadalajara')->first()->id;
        
        Hospital::insert([
            [
                'name' => 'Hospital Infantil de México', 
                'city_id' => $cdmx,
                'type' => 'Público'
            ],
            [
                'name' => 'Centro Médico Nacional Siglo XXI', 
                'city_id' => $cdmx,
                'type' => 'Público'
            ],
            [
                'name' => 'Hospital Civil de Guadalajara', 
                'city_id' => $gdl,
                'type' => 'Público'
            ],
        ]);
    }
}
