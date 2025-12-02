<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterLecturer extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = 'master_lecturer_id';

    public $timestamps = true;

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
