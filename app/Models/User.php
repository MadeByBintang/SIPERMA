<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes; // <-- PENTING: Tambahkan ini
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes; // <-- PENTING: Tambahkan SoftDeletes

    /**
     * Tentukan primary key.
     * (Karena Anda menggunakan 'user_id', bukan 'id')
     */
    protected $primaryKey = 'user_id'; // <-- PENTING

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username', // <-- PENTING: Sesuaikan dengan kolom Anda
        'email',
        'password',
        'role_id', // <-- PENTING: Sesuaikan dengan kolom Anda
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // Kita hapus 'email_verified_at' karena tidak ada di tabel Anda
            'password' => 'hashed',
        ];
    }

    public function getAuthIdentifierName()
    {
        return 'username';
    }

    /**
     * DEFINISI RELASI
     * Satu User HANYA MILIK SATU Role
     */
    public function role()
    {
        // $this->belongsTo(NamaModel, 'foreign_key_di_tabel_ini', 'primary_key_di_tabel_tujuan')
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    // Anda bisa tambahkan relasi lain di sini nanti
    // Contoh: relasi ke Lecturer atau Student

    /**
     * RELASI: Satu User (jika dia Dosen) punya satu data Lecturer
     */
    public function lecturer()
    {
        return $this->hasOne(Lecturer::class, 'user_id', 'user_id');
    }

    /**
     * RELASI: Satu User (jika dia Mahasiswa) punya satu data Student
     */
    public function student()
    {
        return $this->hasOne(Student::class, 'user_id', 'user_id');
    }
}
