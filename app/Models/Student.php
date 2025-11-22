<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $primaryKey = 'student_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'master_student_id',
        'nim',
        'name',   // Pastikan kolom ini ada di tabel students
        'phone',  // Pastikan kolom ini ada di tabel students
        'major',
        'year',
        'gpa',
        'status',
        'enrollment_date',
        'interest_field',
    ];

    // ... relasi masterStudent tetap sama

    /**
     * Relasi ke User (Akun Login)
     */
    public function user()
    {
        // Param 2: FK di tabel students (user_id)
        // Param 3: PK di tabel users (user_id)
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Relasi Many-to-Many ke Skill
     */
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'student_skills', 'student_id', 'skill_id')
                    ->withTimestamps();
    }

    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class, 'student_id', 'student_id');
    }

    public function supervisions()
    {
        return $this->hasMany(Supervision::class, 'student_id', 'student_id');
    }
}