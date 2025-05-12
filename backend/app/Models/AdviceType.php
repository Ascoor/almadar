<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdviceType extends Model
{
    use HasFactory;
    protected $table = 'advice_types';
    protected $fillable = [
        'type_name',
 
    ];
  // العلاقة مع LegalAdvice (One-to-Many)
    public function legalAdvices()
    {
        return $this->hasMany(LegalAdvice::class, 'advice_type_id');  // تعديل هنا
    }
}
