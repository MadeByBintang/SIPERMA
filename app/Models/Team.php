<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use HasFactory, SoftDeletes;

    // Primary Key kustom sesuai migrasi
    protected $primaryKey = 'team_id';

    protected $fillable = [
        'team_name',
        'activity_id',
        'leader_id',     // ID Mahasiswa (Ketua)
        'supervisor_id', // ID Dosen (Pembimbing)
        'type',          // PKL / Competition
        'description',
        'status',        // pending, active, completed
        'progress',      // 0-100
        'company_name',  // Opsional (untuk PKL)
        'competition_date', // Opsional (untuk Lomba)
    ];

    /**
     * Relasi ke Anggota Tim (TeamMember)
     * One-to-Many: Satu tim punya banyak anggota
     */
    public function members()
    {
        return $this->hasMany(TeamMember::class, 'team_id', 'team_id');
    }

    /**
     * Relasi ke Ketua Tim (Student)
     * Belongs-to: Satu tim dimiliki satu ketua
     */
    public function leader()
    {
        return $this->belongsTo(TeamMember::class, 'leader_id', 'student_id'); 
        // Atau jika leader_id merujuk langsung ke tabel students:
        // return $this->belongsTo(Student::class, 'leader_id', 'student_id');
        // Namun berdasarkan controller Anda sebelumnya, leader diambil dari relasi members juga bisa.
        // Tapi best practice-nya relasi leader_id di tabel teams merujuk ke tabel students.
        // Mari kita pakai asumsi leader_id di teams merujuk ke students table.
    }

    /**
     * Relasi ke Supervisor (Lecturer)
     */
    public function supervisor()
    {
        return $this->belongsTo(Lecturer::class, 'supervisor_id', 'lecturer_id');
    }

    /**
     * Relasi ke Activity (Master Data Aktivitas)
     */
    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id', 'activity_id');
    }
}