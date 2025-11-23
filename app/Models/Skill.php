<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Skill extends Model
{
    use HasFactory;

    protected $table = 'skills';
    protected $primaryKey = 'skill_id';
    protected $fillable = ['name'];
    public $timestamps = false;

    public function students()
    {
        return $this->belongsToMany(Student::class)
                    ->withPivot('level')
                    ->withTimestamps();
    }


    public function lecturers()
    {
        return $this->belongsToMany(Lecturer::class)
                    ->withPivot('level', 'priority')
                    ->withTimestamps();
    }

}
