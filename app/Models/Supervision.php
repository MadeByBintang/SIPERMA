<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supervision extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'supervision_id';

    // Tabel ini tidak punya timestamps
    public $timestamps = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'student_id',
        'lecturer_id',
        'team_id',
        'activity_id',
        'supervision_status',
        'assigned_date',
        // 'academic_year', // Sudah dihapus
        'notes',
    ];

    /**
     * RELASI: Supervisi ini milik satu Mahasiswa
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    /**
     * RELASI: Supervisi ini milik satu Dosen
     */
    public function lecturer()
    {
        return $this->belongsTo(Lecturer::class, 'lecturer_id', 'lecturer_id');
    }

    /**
     * RELASI: Supervisi ini milik satu Tim
     */
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'team_id');
    }

    /**
     * RELASI: Supervisi ini milik satu Aktivitas
     */
    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id', 'activity_id');
    }

    // --- FUNGSI activityLogs() DIHAPUS KARENA KOLOMNYA SUDAH TIDAK ADA ---
}