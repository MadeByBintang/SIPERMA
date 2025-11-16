<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'team_member_id';

    // Tabel ini tidak punya timestamps
    public $timestamps = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'team_id',
        'student_id',
        'role_in_team',
    ];

    /**
     * RELASI: Satu anggota tim adalah milik satu Tim
     */
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'team_id');
    }

    /**
     * RELASI: Satu anggota tim adalah milik satu Mahasiswa
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }
}