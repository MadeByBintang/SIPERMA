<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityType extends Model
{
    use HasFactory;

    // Sesuaikan dengan nama tabel di database
    protected $table = 'activity_types';

    // Primary Key kustom sesuai migrasi
    protected $primaryKey = 'activity_type_id'; 
    
    // Matikan timestamps karena di migrasi Anda kolom timestamps() dikomentari
    public $timestamps = false; 

    protected $fillable = [
        'type_name', 
        'description'
    ];

    // Relasi ke Activity (One to Many)
    // Satu Tipe (misal PKL) bisa punya banyak Activity
    public function activities()
    {
        return $this->hasMany(Activity::class, 'activity_type_id', 'activity_type_id');
    }
}