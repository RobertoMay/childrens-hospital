<?php

namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Requests\PartialUpdatePatientRequest;
use App\Http\Resources\PatientResource;
use App\Models\Patient;
use Illuminate\Http\JsonResponse; 
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Barryvdh\DomPDF\Facade\Pdf;

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
        $existingPatient = Patient::whereRaw('LOWER(full_name) = ?', [strtolower($request->full_name)])
            ->whereDate('birth_date', $request->birth_date)
            ->first();

        if ($existingPatient) {
            return response()->json([
                'success' => false,
                'message' => 'Paciente duplicado',
                'errors' => [
                    'full_name' => ['Ya existe un paciente con este nombre y fecha de nacimiento']
                ],
                'existing_patient' => new PatientResource($existingPatient)
            ], Response::HTTP_CONFLICT); // 409 Conflict es más apropiado para duplicados
        }

        try {
            $patient = Patient::create($request->validated());
            
            return response()->json([
                'success' => true,
                'message' => 'Paciente creado exitosamente',
                'data' => new PatientResource($patient)
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear paciente',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Patient $patient): JsonResponse
    {
        return response()->json([
            'data' => new PatientResource($patient->load(['city', 'hospital']))
        ], Response::HTTP_OK);
    }

    public function update(UpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        try {
            $patient->update($request->validated());
            
            return response()->json([
                'message' => 'Paciente actualizado exitosamente',
                'data' => new PatientResource($patient)
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar paciente',
                'error' => $e->getMessage()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    public function partialUpdate(PartialUpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        try {

        
            $patient->update($request->validated());

            return response()->json([
                'message' => 'Paciente actualizado exitosamente',
                'data' => new PatientResource($patient)
            ], Response::HTTP_OK);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar paciente',
                'error' => $e->getMessage()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $patient = Patient::findOrFail($id);
            
            $patient->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Paciente eliminado exitosamente',
                'deleted_id' => $patient->id
            ], Response::HTTP_OK);
            
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Paciente no encontrado',
                'error' => 'No existe un paciente con el ID proporcionado'
            ], Response::HTTP_NOT_FOUND);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar paciente',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function search(Request $request): JsonResponse
    {
        try {
            $query = Patient::query()->with(['city', 'hospital']);

            if ($request->filled('name')) {
                $query->whereRaw('LOWER(full_name) LIKE ?', ['%' . strtolower($request->name) . '%']);
            }

            if ($request->filled('hospital_id')) {
                $query->where('hospital_id', $request->hospital_id);
            }

            if ($request->filled('city_id')) {
                $query->where('city_id', $request->city_id);
            }

            $patients = $query->orderBy('full_name')->paginate(10);

            return response()->json([
                'data' => $patients->isEmpty() ? [] : PatientResource::collection($patients),
                'meta' => [
                    'current_page' => $patients->currentPage(),
                    'total_pages' => $patients->lastPage(),
                    'total_items' => $patients->total(),
                ]
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la búsqueda',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function generatePdf(Patient $patient)
{
    $data = [
        'patient' => $patient,
        'age' => $patient->age . ' años', // Ejemplo de dato calculado
        'current_date' => now()->format('d/m/Y')
    ];
    
    $pdf = PDF::loadView('patients.pdf', $data);
    
    return $pdf->download('paciente-'.$patient->id.'.pdf');
}
}