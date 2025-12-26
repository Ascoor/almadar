<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LegalAdviceComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'legal_advice_id',
        'user_id',
        'comment',
    ];

    public function legalAdvice()
    {
        return $this->belongsTo(LegalAdvice::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
