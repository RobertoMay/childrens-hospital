<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
   use HasFactory;

   protected $table = 'patients';

   protected $fillable = [
    'full_name',
    'age',
    'gender',
    'birth_date',
    'city_id',
    'hospital_id',
    'tutor_name',
    'tutor_phone',
    'registration_date'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'registration_date' => 'date'
    ];


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
