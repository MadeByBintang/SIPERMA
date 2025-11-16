<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'notification_id';

    // ERD Anda hanya punya 'created_at', tidak ada 'updated_at'
    // Jadi kita set manual
    public const UPDATED_AT = null;
    public const CREATED_AT = 'created_at';

    // Kolom yang boleh diisi
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'title',
        'message',
        'type',
        'read_at',
    ];

    /**
     * RELASI: Notifikasi ini dikirim oleh satu User (Sender)
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'user_id');
    }

    /**
     * RELASI: Notifikasi ini diterima oleh satu User (Receiver)
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id', 'user_id');
    }
}