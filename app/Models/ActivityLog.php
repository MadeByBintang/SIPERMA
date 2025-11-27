<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $table = 'activity_logs';

    protected $primaryKey = 'log_id';

    public $timestamps = false;

    protected $fillable = [
        'activity_id',
        'log_date',
        'progress_note',
    ];

    protected $casts = [
        'log_date' => 'datetime',
    ];


    public function activity()
    {

        return $this->belongsTo(Activity::class, 'activity_id', 'activity_id');
    }
}
