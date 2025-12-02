<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Internship extends Model
{
    use HasFactory;

    protected $table = 'internships';

    protected $primaryKey = 'internship_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'address',
        'sector',
        'owner_name',
        'owner_email',
        'owner_phone',
    ];

    public function activities()
    {

        return $this->hasMany(Activity::class, 'internship_id', 'internship_id');
    }
}
