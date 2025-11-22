<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    // Sesuai screenshot, Primary Key adalah 'activity_id'
    protected $primaryKey = 'activity_id';

    protected $fillable = [
        'activity_type_id',
        'institution_id',
        'title',
        'description',
        'start_date',
        'end_date',
    ];

    /**
     * Relasi ke Tipe Aktivitas
     */
    public function activityType()
    {
        return $this->belongsTo(ActivityType::class, 'activity_type_id', 'activity_type_id');
    }

    public function institution()
    {
        
        return $this->belongsTo(Institution::class, 'institution_id', 'id');
    }

    public function logs()
    {
        // hasMany(ModelTujuan, ForeignKeyDiSana, LocalKeyDiSini)
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