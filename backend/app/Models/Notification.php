<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    // الأعمدة القابلة للتعبئة

    protected $fillable = ['user_id', 'title', 'message', 'link','notifiable_type', 'notifiable_id' ,'read'];

    // علاقة "إلى المستخدم"
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // علاقة polymorphic مع أي كائن آخر
    public function notifiable()
    {
        return $this->morphTo(); // هذا يربطها إلى `notifiable_type` و `notifiable_id`
    }
}
