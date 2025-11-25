<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $primaryKey = 'activity_id';

    protected $fillable = [
        'activity_type_id',
        'internship_id',
        'title',
        'description',
        'start_date',
        'end_date',
        'topics',
    ];

    protected $casts = [
        'topics' => 'array',
    ];


    public function activityType()
    {
        return $this->belongsTo(ActivityType::class, 'activity_type_id', 'activity_type_id');
    }


    public function internship()
    {
        return $this->belongsTo(Internship::class, 'internship_id', 'internship_id');
    }

    public function logs()
    {

        return $this->hasMany(ActivityLog::class, 'activity_id', 'activity_id');
    }

   
    public function teams()
    {
        return $this->hasMany(Team::class, 'activity_id', 'activity_id');
    }

   
    public function supervisions()
    {
        return $this->hasMany(Supervision::class, 'activity_id', 'activity_id');
    }
}