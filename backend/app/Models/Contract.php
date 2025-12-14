<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_category_id',
        'scope',
        'number',
        'contract_parties',
        'value',
        'start_date',
        'end_date',
        'notes',
        'attachment',
        'status',
        'summary',
        'created_by',
        'updated_by',
        'assigned_to_user_id',
        'assigned_by_user_id',
        'updated_by_user_id',
    ];
public function notifications()
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }
// Contract.php

public function scopeLocal($query)
{
    return $query->where('scope', 'local');
}

public function scopeInternational($query)
{
    return $query->where('scope', 'international');
}

    public function category()
    {
        return $this->belongsTo(ContractCategory::class, 'contract_category_id');
    }
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

}
