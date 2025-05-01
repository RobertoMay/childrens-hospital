<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            if (!Schema::hasTable('cities')) {
                Schema::create('cities', function (Blueprint $table) {
                    $table->id();
                    $table->string('name');
                    $table->timestamps();
                });
            }

            if (!Schema::hasTable('hospitals')) {
                Schema::create('hospitals', function (Blueprint $table) {
                    $table->id();
                    $table->string('name');
                    $table->timestamps();
                });
            }

            $table->foreignId('city_id')->nullable()->constrained();
            $table->foreignId('hospital_id')->nullable()->constrained();

            $table->dropColumn(['origin_hospital', 'city_origin']);
        });
    }

    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            // Revierte los cambios si es necesario
            $table->dropForeign(['city_id']);
            $table->dropForeign(['hospital_id']);
            $table->dropColumn(['city_id', 'hospital_id']);
            $table->string('origin_hospital');
            $table->string('city_origin');
        });
    }
};
