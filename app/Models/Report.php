<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    // Tentukan Primary Key
    protected $primaryKey = 'report_id';

    // Tabel ini punya timestamps (created_at, updated_at)
    // Sesuai migrasi Anda

    // Kolom yang boleh diisi
    protected $fillable = [
        'report_type',
        'report_period',
        'generated_by',
        'status',
        'description',
    ];

    /**
     * RELASI: Laporan ini di-generate oleh satu User
     */
    public function generator()
    {
        // 'generated_by' adalah foreign key ke 'user_id' di tabel users
        return $this->belongsTo(User::class, 'generated_by', 'user_id');
    }
}