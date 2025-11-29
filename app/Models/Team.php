<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'teams';

    // 1. Primary Key sesuai database
    protected $primaryKey = 'team_id';

    // 2. Mass Assignment
    protected $fillable = [
        'activity_id',
        'team_name',
        'description',
    ];


    public function members()
    {
        return $this->hasMany(TeamMember::class, 'team_id', 'team_id');
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id', 'activity_id');
    }

    public function supervision(){
        return $this -> belongsTo(Supervision::class, 'team_id', 'team_id');
    }
}
