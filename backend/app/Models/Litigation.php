<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Litigation extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_number',
        'case_year',
        'court',
        'scope',        // 'from' or 'against'
        'opponent',
        'subject',
        'filing_date',
        'status',       // 'open', 'in_progress', 'closed'
        'notes',
        'results',

        'created_by',
        'updated_by',
        'assigned_to_user_id',
        'assigned_by_user_id',
        'updated_by_user_id',
    ];
    public function creator()
{
    return $this->belongsTo(User::class, 'created_by');
}

public function updater()
{
    return $this->belongsTo(User::class, 'updated_by');
}

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by_user_id');
    }

    public function lastUpdatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }
    protected $casts = [
        'filing_date' => 'date',
    ];

    public function actions()
    {
        return $this->hasMany(LitigationAction::class);
    }

    // ✅ optional: Scope for active/open litigations
    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'closed');
    }

    // ✅ optional: Get a readable status
    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            'open' => 'مفتوحة',
            'in_progress' => 'قيد التنفيذ',
            'closed' => 'مغلقة',
            default => 'غير معروف',
        };
    }
}
