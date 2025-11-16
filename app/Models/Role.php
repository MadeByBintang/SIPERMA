<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    /**
     * Tentukan primary key.
     * (Karena nama PK Anda 'role_id', bukan 'id' standar)
     */
    protected $primaryKey = 'role_id';

    /**
     * Matikan timestamps (created_at, updated_at) 
     * karena tidak ada di tabel 'roles' Anda.
     */
    public $timestamps = false;

    /**
     * Kolom yang boleh diisi massal.
     * (Ini penting untuk Seeder)
     */
    protected $fillable = [
        'role_name',
    ];

    /**
     * DEFINISI RELASI
     * Satu Role BISA MEMILIKI BANYAK User
     */
    public function users()
    {
        // $this->hasMany(NamaModel, 'foreign_key_di_tabel_tujuan', 'primary_key_di_tabel_ini')
        return $this->hasMany(User::class, 'role_id', 'role_id');
    }
}