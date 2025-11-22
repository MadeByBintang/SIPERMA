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
    public $timestamps = false;

    // Kolom yang boleh diisi
    protected $fillable = [
        'activity_id', // <--- PERUBAHAN 1: Ganti supervision_id jadi activity_id
        'user_id',
        'log_date',
        'progress_note',
        'action_type',
    ];

    /**
     * RELASI: Log ini milik satu Activity
     * PERUBAHAN 2: Ubah nama fungsi dan target Model
     */
    public function activity()
    {
        // Parameter: (Model Tujuan, Foreign Key di sini, Primary Key di sana)
        // Asumsi PK di tabel activities adalah 'activity_id' (sesuai pola Anda)
        return $this->belongsTo(Activity::class, 'activity_id', 'activity_id');
    }

    /**
     * RELASI: Log ini dibuat oleh satu User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}