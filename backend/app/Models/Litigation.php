<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Litigation extends Model
{

    protected $fillable = [
        'case_number',
        'court',
        'scope',
        'opponent',
        'subject',
        'filing_date',
        'status',            // open | in_progress | closed
        'notes',
    ];

    public function actions()
    {
        return $this->hasMany(LitigationAction::class);
    }
}
