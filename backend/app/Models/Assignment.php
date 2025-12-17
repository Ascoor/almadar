<?php

namespace App\Models;

use App\Enums\AssignmentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assignment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_id',
        'assigned_to_user_id',
        'assigned_by_user_id',
        'status',
        'due_date',
    ];

    protected $casts = [
        'status' => AssignmentStatus::class,
        'due_date' => 'date',
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
        return $this->belongsTo(User::class, 'assigned_by_user_id');
    }
}
