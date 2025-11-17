<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Skills extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function students()
    {
        return $this->belongsToMany(Student::class)
                    ->withPivot('level')
                    ->withTimestamps();
    }

    public function lecturers()
    {
        return $this->belongsToMany(Lecturer::class)
                    ->withPivot('level')
                    ->withTimestamps();
    }

}
