<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->integer('age');
            $table->enum('gender', ['Masculino', 'Femenino', 'Otro']);
            $table->date('birth_date');
            $table->foreignId('city_id')->constrained();
            $table->foreignId('hospital_id')->constrained();
            $table->string('tutor_name', 100);
            $table->string('tutor_phone', 20);
            $table->date('registration_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
