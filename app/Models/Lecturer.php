<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Lecturer extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'lecturer_id';

    // Tabel ini tidak punya timestamps
    public $timestamps = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'master_lecturer_id',
        'user_id',
        'supervision_quota',
    ];

    /**
     * RELASI: Satu Lecturer adalah milik satu MasterLecturer (biodata)
     */
    public function masterLecturer()
    {
        return $this->belongsTo(MasterLecturer::class, 'master_lecturer_id', 'master_lecturer_id');
    }

    /**
     * RELASI: Satu Lecturer adalah milik satu User (akun login)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * RELASI: Satu Lecturer bisa punya BANYAK expertise
     */
    public function skills()
    {
        return $this->belongsToMany(Skills::class)
                    ->withPivot('level')
                    ->withTimestamps();
    }


    public function supervisions()
    {
        return $this->hasMany(Supervision::class, 'lecturer_id', 'lecturer_id');
    }
}
