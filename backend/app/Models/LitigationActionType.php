<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LitigationActionType extends Model
{
    use HasFactory;

    protected $fillable = [
        'action_name', // name of the action type
    ];

    // Relationship with LitigationAction (One to Many)
    public function litigationActions()
    {
        return $this->hasMany(LitigationAction::class);
    }
}
