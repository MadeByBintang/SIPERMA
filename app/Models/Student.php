<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'student_id';

    // Tabel ini tidak punya timestamps
    public $timestamps = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'master_student_id',
        'user_id',
        'interest_field',
    ];

    /**
     * RELASI: Satu Student adalah milik satu MasterStudent (biodata)
     */
    public function masterStudent()
    {
        return $this->belongsTo(MasterStudent::class, 'master_student_id', 'master_student_id');
    }

    /**
     * RELASI: Satu Student adalah milik satu User (akun login)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }


    public function skills()
    {
        return $this->belongsToMany(Skill::class)
                    ->withPivot('level')
                    ->withTimestamps();
    }

    /**
     * RELASI: Satu Student bisa tergabung di BANYAK team members
     */
    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class, 'student_id', 'student_id');
    }

    /**
     * RELASI: Satu Student bisa punya BANYAK supervisions
     */
    public function supervisions()
    {
        return $this->hasMany(Supervision::class, 'student_id', 'student_id');
    }
}
