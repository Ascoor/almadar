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
    ];

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
