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
       'action_type_id',
        'officer_name',
        'requirements',
        'results',
        'status', // pending | in_review | done
  
        'created_by',
        'updated_by',
    ];
    public function creator()
{
    return $this->belongsTo(User::class, 'created_by');
}

public function updater()
{
    return $this->belongsTo(User::class, 'updated_by');
}

    // ✅ علاقة: كل إجراء يتبع تحقيق واحد
    public function investigation()
    {
        return $this->belongsTo(Investigation::class, 'investigation_id');
    }
    // ✅ علاقة: كل إجراء يتبع نوع الإجراء واحد
    public function actionType()
    {
        return $this->belongsTo(InvestigationActionType::class);
    }
}
