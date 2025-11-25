<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $primaryKey = 'student_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'master_student_id',
        'nim',
        'name',
        'status',
    ];

    public function masterStudent()
    {
        return $this->belongsTo(MasterStudent::class, 'master_student_id', 'master_student_id');
    }

    public function getNameAttribute()
    {
        return $this->masterStudent->full_name ?? $this->attributes['name'] ?? '-';
    }

    public function getNimAttribute(){
        return $this -> masterStudent -> nim ?? '-';
    }

    public function getEmailAttribute()
    {
        return $this->masterStudent->email ?? '-';
    }

    public function getStatusAttribute(){
        return $this -> masterStudent -> is_active;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function teamMembers() { return $this->hasMany(TeamMember::class, 'student_id', 'student_id'); }
    public function supervisions() { return $this->hasMany(Supervision::class, 'student_id', 'student_id'); }
}
