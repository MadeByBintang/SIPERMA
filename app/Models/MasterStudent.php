<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterStudent extends Model
{
    use HasFactory;


    protected $primaryKey = 'master_student_id';


    public $timestamps = true;


    protected $fillable = [
        'nim',
        'full_name',
        'email',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];


    public function student()
    {
        return $this->hasOne(Student::class, 'master_student_id', 'master_student_id');
    }
}
