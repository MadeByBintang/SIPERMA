<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $table = 'team_members';


    protected $primaryKey = 'team_member_id';

    public $timestamps = false;

    protected $fillable = [
        'team_id',
        'student_id',

    ];

    public function team()
    {

        return $this->belongsTo(Team::class, 'team_id', 'team_id');
    }


    public function student()
    {

        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    


}
