<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Legislation extends Model
{
    use HasFactory;

    protected $fillable = [
        'decision_date',
        'drafting',
        'issuing_entity',
        'decision_number',
        'decision_topic',
        'attachment',
    ];
}
