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
        'master_student_id', // Kunci ke data master
        'nim',
        'name',
        'status',
        'interest_field',
    ];

    // Relasi ke Master Data
    public function masterStudent()
    {
        return $this->belongsTo(MasterStudent::class, 'master_student_id', 'master_student_id');
    }

    // Helper Accessor: Ambil Nama dari Master
    public function getNameAttribute()
    {
        // Ambil dari master, jika null ambil dari kolom lokal (jika ada)

        return $this->masterStudent->full_name ?? $this->attributes['name'] ?? '-';
    }

    public function getNimAttribute(){
        return $this -> masterStudent -> nim ?? '-';
    }

    // Helper Accessor: Ambil Email dari Master
    public function getEmailAttribute()
    {
        return $this->masterStudent->email ?? '-';
    }

    // ... relasi lain (user, skills, dll) tetap sama
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function skills()
    {
        return $this->belongsToMany(
            Skill::class,
            'student_skills',
            'student_id',
            'skill_id'
            )->withPivot('level')
            ->withTimestamps();
    }

    public function teamMembers() { return $this->hasMany(TeamMember::class, 'student_id', 'student_id'); }
    public function supervisions() { return $this->hasMany(Supervision::class, 'student_id', 'student_id'); }
}
