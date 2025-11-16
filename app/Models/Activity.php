<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'activity_id';

    // Tabel ini MEMILIKI timestamps (created_at, updated_at)
    // Jadi kita TIDAK perlu menambahkan 'public $timestamps = false;'

    // Kolom yang boleh diisi
    protected $fillable = [
        'activity_type_id',
        'title',
        'description',
        'start_date',
        'end_date',
    ];

    /**
     * RELASI: Satu Aktivitas adalah milik satu Tipe Aktivitas
     */
    public function activityType()
    {
        return $this->belongsTo(ActivityType::class, 'activity_type_id', 'activity_type_id');
    }

    /**
     * RELASI: Satu Aktivitas bisa memiliki BANYAK Tim
     */
    public function teams()
    {
        return $this->hasMany(Team::class, 'activity_id', 'activity_id');
    }

    /**
     * RELASI: Satu Aktivitas bisa memiliki BANYAK Supervisi
     */
    public function supervisions()
    {
        return $this->hasMany(Supervision::class, 'activity_id', 'activity_id');
    }
}