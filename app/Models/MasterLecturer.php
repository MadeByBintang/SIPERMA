<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterLecturer extends Model
{
    use HasFactory;

    protected $primaryKey = 'master_lecturer_id';

    public $timestamps = false;

    protected $fillable = [
        'nip',
        'full_name',
        'email',
        'is_active',

    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
