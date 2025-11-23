<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecturer extends Model
{
    use HasFactory;

    protected $primaryKey = 'lecturer_id'; // Sesuaikan dengan DB
    public $timestamps = false; // Sesuaikan dengan DB

    protected $fillable = [
        'user_id',
        'master_lecturer_id',
        'nip',
        'name',
        //'phone',
        'description',
        'academic_titles',
        'expertise',
        'office_location',
        'quota',
        'is_available'
    ];

    protected $casts = [
        'academic_titles' => 'array',
        'expertise' => 'array',
        'is_available' => 'boolean',
    ];

    public function user()
    {
        // Param 2: FK di tabel lecturers (user_id)
        // Param 3: PK di tabel users (user_id)
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    
    public function masterLecturer()
    {
        return $this->belongsTo(MasterLecturer::class, 'master_lecturer_id', 'master_lecturer_id');
    }

    public function supervisions()
    {
        return $this->hasMany(Supervision::class, 'lecturer_id', 'lecturer_id');
    }

    /**
     * Relasi Many-to-Many ke Skill.
     * DEFINISIKAN NAMA TABEL PIVOT 'lecturer_skills' SECARA EKSPLISIT (JAMAK)
     */
    public function skills()
    {
        // Parameter:
        // 1. Model Tujuan (Skill::class)
        // 2. Nama Tabel Pivot ('lecturer_skills') <-- INI YANG DIPERBAIKI (JAMAK)
        // 3. Foreign Key model ini di pivot ('lecturer_id')
        // 4. Foreign Key model tujuan di pivot ('skill_id')

        return $this->belongsToMany(Skill::class, 'lecturer_skills', 'lecturer_id', 'skill_id')
                    ->withPivot('level')
                    ->withTimestamps();
    }
}