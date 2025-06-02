<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_type',
        'model_id',
        'title',
        'number',
        'file_path',
        'extracted_text',
        'file_type',
    ];

    /**
     * ربط الأرشيف بالسجل المرتبط به (عقد، مشورة، قضية...).
     */
    public function model()
    {
        return $this->morphTo();
    }
}
