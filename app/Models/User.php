<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'user_id',
        'role_id',
        'username',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function username()
    {
        return 'username';
    }


    // Relasi ke tabel roles
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    // Accessor agar bisa dipanggil sebagai $user->role_name
    public function getRoleNameAttribute()
    {
        return $this->role->role_name ?? null;
    }

    // Relasi jika nanti dipakai
    public function lecturer()
    {
        return $this->hasOne(Lecturer::class, 'user_id', 'user_id');
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'user_id', 'user_id');
    }

    public function admin(){
        return $this -> hasOne(Admin::class, 'user_id', 'user_id');
    }

    public function profile(){
        return [
            'full_name' =>
                $this->role_name === 'mahasiswa'
                    ? $this->student?->masterStudent?->full_name
                : ($this->role_name === 'dosen'
                    ? $this->lecturer?->masterLecturer?->full_name
                : ($this->role_name === 'admin'
                    ? $this->admin?->full_name
                : 'Hanni bi Fullan')),


            'id_number' => $this->role_name === 'mahasiswa'
                    ? $this->student?->masterStudent?->nim
                : ($this->role_name === 'dosen'
                    ? $this->lecturer?->masterLecturer?->nip
                : ($this->role_name === 'admin'
                    ? 'admin'
                : '-')),
        ];
    }
}
