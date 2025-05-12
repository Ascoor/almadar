<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestigationActionType extends Model
{
    use HasFactory;

    protected $fillable = [
        'action_name', // name of the action type
    ];

    // Relationship with InvestigationAction (One to Many)
    public function investigationActions()
    {
        return $this->hasMany(InvestigationAction::class);
    }
}
