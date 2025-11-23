<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LecturerSkill extends Model
{
    use HasFactory;

    protected $table = 'lecturer_skills';

    public $timestamps = true;

    // Kolom yang boleh diisi
    protected $fillable = [
        'lecturer_id',
        'skill_id',
        'level',
        'priority'
    ];

    public function lecturer()
    {
        return $this->belongsTo(Lecturer::class, 'lecturer_id', 'lecturer_id');
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class, 'skill_id', 'skill_id');
    }
}
