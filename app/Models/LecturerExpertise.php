<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LecturerExpertise extends Model
{
    use HasFactory;

    // Tentukan nama tabelnya secara manual (karena Laravel mungkin mengira 'lecturer_expertises')
    protected $table = 'lecturer_expertise';
    
    // Tentukan Primary Key
    protected $primaryKey = 'expertise_id';

    // Tabel ini tidak punya timestamps
    public $timestamps = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'lecturer_id',
        'expertise_name',
    ];

    /**
     * RELASI: Satu Expertise adalah milik satu Lecturer
     */
    public function lecturer()
    {
        return $this->belongsTo(Lecturer::class, 'lecturer_id', 'lecturer_id');
    }
}