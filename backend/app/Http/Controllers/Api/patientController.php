<?php

namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Requests\PartialUpdatePatientRequest;
use App\Http\Resources\PatientIndexResource;
use App\Http\Resources\PatientShowResource;
use App\Models\Patient;
use Illuminate\Http\JsonResponse; 
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Barryvdh\DomPDF\Facade\Pdf;

class PatientController extends Controller 
{
    
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1'
        ]);

        $perPage = $request->input('per_page', 10);
        
        $patients = Patient::with(['city:id,name', 'hospital:id,name'])
            ->orderBy('full_name')
            ->paginate($perPage);

        return response()->json([
            'data' => PatientIndexResource::collection($patients),
            'pagination' => [
                'current_page' => $patients->currentPage(),
                'per_page' => $patients->perPage(),
                'total_pages' => $patients->lastPage(),
                'total_items' => $patients->total(),
                'has_prev_page' => $patients->currentPage() > 1,
                'has_next_page' => $patients->currentPage() < $patients->lastPage(),
                'prev_page' => $patients->currentPage() > 1 ? $patients->currentPage() - 1 : null,
                'next_page' => $patients->currentPage() < $patients->lastPage() ? $patients->currentPage() + 1 : null,
                'first_page' => 1,
                'last_page' => $patients->lastPage()
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
                'existing_patient' => new PatientIndexResource($existingPatient)
            ], Response::HTTP_CONFLICT); // 409 Conflict es más apropiado para duplicados
        }

        try {
            $patient = Patient::create($request->validated());
            
            return response()->json([
                'success' => true,
                'message' => 'Paciente creado exitosamente',
                'data' => new PatientIndexResource($patient)
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
            'data' => new PatientShowResource($patient)
        ], Response::HTTP_OK);
    }

    public function update(UpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        try {
            $patient->update($request->validated());
            
            return response()->json([
                'message' => 'Paciente actualizado exitosamente',
                'data' => new PatientIndexResource($patient)
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
                'data' => new PatientIndexResource($patient)
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


    public function generatePdf(Patient $patient)
    {
        $data = [
            'patient' => $patient->load(['city', 'hospital']),
            'age' => $patient->age . ' años',
            'current_date' => now()->format('d/m/Y H:i')
        ];
        
        $pdf = PDF::loadView('patients.pdf', $data)
                ->setPaper('a4', 'portrait')
                ->setOption('enable-local-file-access', true);
        
        return $pdf->download('ficha-paciente-'.$patient->id.'.pdf');
    }
}