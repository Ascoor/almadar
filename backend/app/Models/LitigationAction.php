<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LitigationAction extends Model
{
    use HasFactory;

    protected $fillable = [
        'litigation_id',
  'action_type_id',
        'action_date',
        'requirements',
        'results',
        'lawyer_name',
        'location',
        'notes',
        'status',
    ];

    public function litigation()
    {
        return $this->belongsTo(Litigation::class);
    }
    public function actionType()
    {
        return $this->belongsTo(LitigationActionType::class);
    }
}
