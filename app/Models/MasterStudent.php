<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterStudent extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'master_student_id';

    // Tabel ini tidak punya timestamps (created_at/updated_at)
    public $timestamps = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'nim',
        'full_name',
        'email',
    ];

    /**
     * RELASI: Satu MasterStudent punya satu data Student (jembatan ke User)
     */
    public function student()
    {
        return $this->hasOne(Student::class, 'master_student_id', 'master_student_id');
    }
}