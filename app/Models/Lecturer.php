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
        'email',
        // 'academic_titles',
        'supervision_quota',
        'status'
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

    public function getNameAttribute(){
        return $this -> masterLecturer -> full_name ?? $this->attributes['name'] ?? '-' ;
    }

    public function getNipAttribute(){
        return $this -> masterLecturer -> nip ?? $this -> attributes['nip'] ?? '-';
    }

    public function getEmailAttribute()
    {
        return $this -> masterLecturer -> email ?? '-';
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
        return $this->belongsToMany(Skill::class, 'lecturer_skills', 'lecturer_id', 'skill_id')
                    ->withPivot('level')
                    ->withTimestamps();
    }
}
