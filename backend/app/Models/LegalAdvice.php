<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LegalAdvice extends Model
{
    use HasFactory;
    protected $table = 'legal_advices';

    protected $fillable = [
        'advice_type_id',
        'topic',
        'text',
        'requester',
        'issuer',
        'advice_date',
        'advice_number',
        'attachment',
        'notes',
    ];

    // العلاقة مع AdviceType (Many-to-One)
    public function adviceType()
    {
        return $this->belongsTo(AdviceType::class, 'advice_type_id');
    }

}
