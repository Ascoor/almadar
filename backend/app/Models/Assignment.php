<?php

namespace App\Models;

use App\Enums\AssignmentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assignment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'order_id',
        'assigned_to_user_id',
        'assigned_by_admin_id',
        'status',
        'due_date',
    ];

    protected $casts = [
        'due_date' => 'date',
        'status' => AssignmentStatus::class,
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by_admin_id');
    }
}
