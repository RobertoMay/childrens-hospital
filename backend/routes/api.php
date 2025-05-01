<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\patientController;

Route::prefix('patients')->group(function () {
    Route::get('/', [PatientController::class, 'index']);
    Route::post('/', [PatientController::class, 'store']);
    Route::get('/{patient}', [PatientController::class, 'show']);
    Route::put('/{patient}', [PatientController::class, 'update']);
    Route::patch('/{patient}', [PatientController::class, 'partialUpdate']);
    Route::delete('/{patient}', [PatientController::class, 'destroy']);
    Route::get('/search', [PatientController::class, 'search']);
});

Route::get('/hospitals', [citiesController::class, 'index']);

Route::get('/cities', [hospitalsController::class, 'index']);
