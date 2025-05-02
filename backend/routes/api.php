<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\patientController;

Route::prefix('patients')->group(function () {
    Route::get('/', [PatientController::class, 'index']);
    Route::post('/', [PatientController::class, 'store']);
    Route::get('/search', [PatientController::class, 'search']);
    Route::get('/{patient}', [PatientController::class, 'show']);
    Route::put('/{patient}', [PatientController::class, 'update']);
    Route::patch('/{patient}', [PatientController::class, 'partialUpdate']);
    Route::delete('/{id}', [PatientController::class, 'destroy']);
    Route::get('/{patient}/pdf', [PatientController::class, 'generatePdf']);
});


Route::get('/cities', function () {
    return response()->json([
        'data' => App\Models\City::orderBy('name')->get(['id', 'name', 'state']),
        'meta' => ['count' => App\Models\City::count()]
    ]);
});

Route::get('/hospitals', function () {
        return response()->json([
            'data' => App\Models\Hospital::with('city:id,name')
                       ->orderBy('name')
                       ->get(['id', 'name', 'city_id']),
            'meta' => ['count' => App\Models\Hospital::count()]
        ]);
    });

