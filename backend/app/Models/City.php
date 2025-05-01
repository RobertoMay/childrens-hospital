<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $fillable = ['name', 'state'];

    public function hospitals(): HasMany
    {
        return $this->hasMany(Hospital::class);
    }
}
