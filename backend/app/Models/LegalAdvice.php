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

        'created_by',
        'updated_by',
        'assigned_to_user_id',
        'assigned_by_user_id',
        'updated_by_user_id',
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

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by_user_id');
    }

    public function lastUpdatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }
    // العلاقة مع AdviceType (Many-to-One)
    public function adviceType()
    {
        return $this->belongsTo(AdviceType::class, 'advice_type_id');
    }

}
