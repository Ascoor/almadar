<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investigation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_name',
        'source',
        'decision',  
        'subject',
        'case_number',
        'status',
        'notes',
    ];

    // علاقة تحقيق إلى إجراءات
    public function actions()
    {
        return $this->hasMany(InvestigationAction::class);
    }
}
