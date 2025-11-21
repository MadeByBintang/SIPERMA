<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $primaryKey = 'admin_id';
    public $timestamps = false;

    protected $fillable = [
        'full_name',
        'email',
        'user_id'
    ];

    public function user() {
        return $this -> belongsTo(User::class, 'user_id', 'user_id');
    }
}
