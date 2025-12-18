<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

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
        'created_by',
        'updated_by',
    ];

    /**
     * ربط الأرشيف بالسجل المرتبط به (عقد، مشورة، قضية...).
     */
    public function model()
    {
        return $this->morphTo();
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
