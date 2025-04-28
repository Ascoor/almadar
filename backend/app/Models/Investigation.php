<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investigation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'source', 'subject', 'case_number', 'decision', 'status',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function actions()
    {
        return $this->hasMany(InvestigationAction::class);
    }
}
