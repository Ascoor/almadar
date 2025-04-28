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
    ];

    public function category()
    {
        return $this->belongsTo(ContractCategory::class, 'contract_category_id');
    }
}
