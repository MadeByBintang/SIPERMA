<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterLecturer extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'master_lecturer_id';

    // Tabel ini tidak punya timestamps (created_at/updated_at)
    public $timestamps = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'nip',
        'full_name',
        'email',
    ];

    /**
     * RELASI: Satu MasterLecturer punya satu data Lecturer (jembatan ke User)
     */
    public function lecturer()
    {
        return $this->hasOne(Lecturer::class, 'master_lecturer_id', 'master_lecturer_id');
    }
}