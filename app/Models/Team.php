<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // <-- Tambahkan ini

class Team extends Model
{
    use HasFactory, SoftDeletes; // <-- Tambahkan SoftDeletes

    // Tentukan Primary Key
    protected $primaryKey = 'team_id';

    // Tabel ini MEMILIKI timestamps dan softDeletes

    // Kolom yang boleh diisi
    protected $fillable = [
        'team_name',
        'activity_id',
        'description',
    ];

    /**
     * RELASI: Satu Tim adalah milik satu Aktivitas
     */
    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id', 'activity_id');
    }

    /**
     * RELASI: Satu Tim bisa memiliki BANYAK Anggota (Team Members)
     */
    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class, 'team_id', 'team_id');
    }

    /**
     * RELASI: Satu Tim bisa memiliki BANYAK Supervisi
     * (Asumsi dari ERD: 1 tim bisa disupervisi banyak dosen, misal P1 & P2)
     */
    public function supervisions()
    {
        return $this->hasMany(Supervision::class, 'team_id', 'team_id');
    }
}