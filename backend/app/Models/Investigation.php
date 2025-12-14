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
    // ✅ علاقة: تحقيق يحتوي على عدة إجراءات
    public function actions()
    {
        return $this->hasMany(InvestigationAction::class, 'investigation_id');
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
