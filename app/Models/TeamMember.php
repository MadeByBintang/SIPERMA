<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $primaryKey = 'id'; 

    public $timestamps = true; 
    
    protected $fillable = [
        'team_id',
        'student_id',
        'role_in_team',
        'status', 
    ];
    
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id', 'id'); 
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }
}