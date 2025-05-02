<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\City;

class CitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        City::insert([
            ['name' => 'Ciudad de México', 'state' => 'CDMX'],
            ['name' => 'Guadalajara', 'state' => 'Jalisco'],
            ['name' => 'Monterrey', 'state' => 'Nuevo León'],
            ['name' => 'Mérida', 'state' => 'Yucatán'],
            ['name' => 'Umán', 'state' => 'Yucatán'],
            ['name' => 'Cancún', 'state' => 'Quintana Roo'],
            ['name' => 'Puebla', 'state' => 'Puebla'],
            ['name' => 'Tijuana', 'state' => 'Baja California'],
        ]);
    }
}
