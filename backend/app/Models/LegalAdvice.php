<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LegalAdvice extends Model
{
    use HasFactory;
    protected $table = 'legal_advices';

    protected $fillable = [
        'type',
        'topic',
        'text',
        'requester',
        'issuer',
        'advice_date',
        'advice_number',
        'attachment',
        'notes',
    ];
}
