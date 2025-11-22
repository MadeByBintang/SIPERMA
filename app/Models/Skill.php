<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    // 1. Definisikan Nama Tabel (Opsional jika sesuai konvensi jamak)
    protected $table = 'skills';

    // 2. DEFINISIKAN PRIMARY KEY (WAJIB jika bukan 'id')
    protected $primaryKey = 'skill_id'; 

    // 3. Matikan timestamps jika tabel skills tidak punya created_at/updated_at
    // public $timestamps = false; // Aktifkan baris ini jika error "column created_at not found" muncul nanti

    protected $fillable = ['name', 'description'];

    /**
     * Relasi ke Student.
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_skills', 'skill_id', 'student_id')
                    ->withPivot('level')
                    ->withTimestamps();
    }
    
    /**
     * Relasi ke Lecturer.
     */
    public function lecturers()
    {
        return $this->belongsToMany(Lecturer::class, 'lecturer_skills', 'skill_id', 'lecturer_id')
                    ->withPivot('level')
                    ->withTimestamps();
    }
}