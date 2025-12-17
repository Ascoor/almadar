<?php

namespace App\Models;

use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles, Notifiable, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'image',
        'password',
        'password_changed',
        'phone',
        'status',
        'last_login_at',
        'preferred_language',
        'city_id',
        'area_id',
        'settings',
    ];

    protected $guard_name = 'api';

    protected $with = ['roles', 'permissions'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_login_at' => 'datetime',
        'settings' => 'array',
        'status' => UserStatus::class,
    ];

    public function notifications()
    {
        return $this->morphMany(UserNotification::class, 'notifiable')->orderByDesc('created_at');
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'assigned_to_user_id');
    }

    public function auditLogs()
    {
        return $this->morphMany(AuditLog::class, 'actor');
    }
}
