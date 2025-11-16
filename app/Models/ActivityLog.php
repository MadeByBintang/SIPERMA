<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'log_id';

    // Tabel ini tidak punya timestamps (created_at/updated_at)
    // Dia punya log_date sendiri
    public $timestamps = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'supervision_id',
        'user_id',
        'log_date',
        'progress_note',
        'action_type',
    ];

    /**
     * RELASI: Log ini milik satu Supervisi
     */
    public function supervision()
    {
        return $this->belongsTo(Supervision::class, 'supervision_id', 'supervision_id');
    }

    /**
     * RELASI: Log ini dibuat oleh satu User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}