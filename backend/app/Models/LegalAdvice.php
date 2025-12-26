<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\LegalAdviceComment;

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

        'created_by',
        'updated_by',
        'assigned_to_user_id',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function comments()
    {
        return $this->hasMany(LegalAdviceComment::class)->latest();
    }

    // العلاقة مع AdviceType (Many-to-One)
    public function adviceType()
    {
        return $this->belongsTo(AdviceType::class, 'advice_type_id');
    }

}
