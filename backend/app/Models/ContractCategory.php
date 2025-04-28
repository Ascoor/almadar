<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function contracts()
    {
        return $this->hasMany(Contract::class, 'contract_category_id');
    }
}
