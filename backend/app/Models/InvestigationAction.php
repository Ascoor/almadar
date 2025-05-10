<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestigationAction extends Model
{
    use HasFactory;

    protected $fillable = [
        'investigation_id',
        'action_date',
        'action_type',
        'officer_name',
        'requirements',
        'results',
        'status', // pending | in_review | done
    ];

    // ✅ علاقة: كل إجراء يتبع تحقيق واحد
    public function investigation()
    {
        return $this->belongsTo(Investigation::class, 'investigation_id');
    }
}
