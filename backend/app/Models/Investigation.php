<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investigation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_name',
        'source',
        'decision',     // تأكد أن هذا العمود موجود في migration
        'subject',
        'case_number',
        'status',       // open | in_progress | closed
        'notes',
    ];

    // ✅ علاقة: تحقيق يحتوي على عدة إجراءات
    public function actions()
    {
        return $this->hasMany(InvestigationAction::class, 'investigation_id');
    }
}
