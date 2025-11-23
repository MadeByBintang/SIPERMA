<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentSkill extends Model
{
    use HasFactory;

    protected $table = 'student_skills';

    public $timestamps = true;

    protected $fillable = [
        'student_id',
        'skill_id',
        'level'
    ];

    /**
     * RELASI: Satu Interest adalah milik satu Student
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }
}
