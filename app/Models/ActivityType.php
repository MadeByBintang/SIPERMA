<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityType extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'activity_type_id';

    // Tabel ini tidak punya timestamps
    public $timestamps = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'activity_type_name',
    ];

    /**
     * RELASI: Satu Tipe Aktivitas bisa memiliki BANYAK Aktivitas
     */
    public function activities()
    {
        return $this->hasMany(Activity::class, 'activity_type_id', 'activity_type_id');
    }
}