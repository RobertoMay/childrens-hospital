<?php

namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Resources\PatientResource;
use App\Models\Patient;
use Illuminate\Http\JsonResponse; 
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PatientController extends Controller 
{
    public function index(): JsonResponse
    {
        $patients = Patient::with(['city', 'hospital'])
            ->orderBy('full_name')
            ->paginate(10);

        return response()->json([
            'data' => PatientResource::collection($patients),
            'meta' => [
                'current_page' => $patients->currentPage(),
                'total_pages' => $patients->lastPage(),
                'total_items' => $patients->total(),
            ]
        ], Response::HTTP_OK);
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        $patient = Patient::create($request->validated());

        return response()->json([
            'message' => 'Paciente creado exitosamente',
            'data' => new PatientResource($patient)
        ], Response::HTTP_CREATED);
    }

    public function show(Patient $patient): JsonResponse
    {
        return response()->json([
            'data' => new PatientResource($patient->load(['city', 'hospital']))
        ], Response::HTTP_OK);
    }

    public function update(UpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        $patient->update($request->validated());

        return response()->json([
            'message' => 'Paciente actualizado exitosamente',
            'data' => new PatientResource($patient)
        ], Response::HTTP_OK);
    }

    public function partialUpdate(PartialUpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        $patient->update($request->validated());

        return response()->json([
            'message' => 'Paciente actualizado parcialmente (PATCH)',
            'data' => new PatientResource($patient)
        ], Response::HTTP_OK);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();

        return response()->json([
            'message' => 'Paciente eliminado exitosamente'
        ], Response::HTTP_NO_CONTENT);
    }

    public function search(Request $request): JsonResponse
    {
        $query = Patient::query()
            ->with(['city', 'hospital']);

        if ($request->has('name')) {
            $query->where('full_name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('hospital_id')) {
            $query->where('hospital_id', $request->hospital_id);
        }

        $patients = $query->paginate(10);

        return response()->json([
            'data' => PatientResource::collection($patients),
            'meta' => [
                'current_page' => $patients->currentPage(),
                'total_pages' => $patients->lastPage(),
                'total_items' => $patients->total(),
            ]
        ], Response::HTTP_OK);
    }
}