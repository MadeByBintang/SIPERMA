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
        'team_name',
        'activity_id',
        'leader_id',
        'supervisor_id',
        'description',
        'status',
        'progress',
        'company_name',
        'competition_date',
    ];


    public function members()
    {
        return $this->hasMany(TeamMember::class, 'team_id', 'team_id');
    }


    public function leader()
    {
        return $this->hasOne(TeamMember::class, 'team_id', 'team_id')
            ->orderBy('team_member_id', 'asc');
    }


    public function supervisor()
    {
        return $this->belongsTo(Lecturer::class, 'supervisor_id', 'lecturer_id');
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id', 'activity_id');
    }
}
