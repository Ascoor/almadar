<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Litigation extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_number', 'opponent', 'direction', 'stage', 'status',
    ];
}
