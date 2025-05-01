<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
        ]);
    }
}
