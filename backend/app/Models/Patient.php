<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Patient extends Model
{
   use HasFactory;

   protected $table = 'patients';

   protected $fillable = [
    'full_name',
    'gender',
    'birth_date',
    'city_id',
    'hospital_id',
    'tutor_name',
    'tutor_phone',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'registration_date' => 'date'
    ];

    protected static function booted()
    {
        static::creating(function ($patient) {
            $age = Carbon::parse($patient->birth_date)->age;
            
            if ($age > 18) {
                throw new \Exception('No se puede registrar pacientes mayores de 18 años.');
            }
            
            $patient->age = $age;
            $patient->registration_date = now();
        });

        static::updating(function ($patient) {
            if ($patient->isDirty('birth_date')) {
                $newAge = Carbon::parse($patient->birth_date)->age;
                
                if ($newAge > 18) {
                    throw new \Exception('No se puede actualizar a una edad mayor de 18 años.');
                }
                
                $patient->age = $newAge;
            }
        });
    }

    public static function existsSimilarPatient(string $fullName, string $birthDate): bool
    {
        return static::whereRaw('LOWER(full_name) = ?', [strtolower($fullName)])
            ->where('birth_date', $birthDate)
            ->exists();
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }


    public function hospital(): BelongsTo
    {
        return $this->belongsTo(Hospital::class);
    }

    public function scopeGender($query, $gender)
    {
        return $query->where('gender', $gender);
    }


    public function scopeFromHospital($query, $hospitalId)
    {
        return $query->where('hospital_id', $hospitalId);
    }


    public function getFormattedNameAttribute(): string
    {
        return ucwords(strtolower($this->full_name));
    }


    public function getDetailedAgeAttribute(): string
    {
        $birthDate = $this->birth_date;
        $now = now();
        $years = $now->diffInYears($birthDate);
        $months = $now->diffInMonths($birthDate) % 12;
        
        return "{$years}a {$months}m";
    }
}
