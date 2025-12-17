<?php

namespace App\Models;

use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasRoles;
    use Notifiable;
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'image',
        'phone',
        'password',
        'password_changed',
        'status',
        'last_login_at',
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
        'status' => UserStatus::class,
    ];

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'assigned_to_user_id');
    }

    public function createdAssignments()
    {
        return $this->hasMany(Assignment::class, 'assigned_by_admin_id');
    }

    public function auditLogs()
    {
        return $this->morphMany(AuditLog::class, 'actor');
    }

    public function notifications()
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')->latest();
    }

    public function readNotifications()
    {
        return $this->notifications()->whereNotNull('read_at');
    }

    public function unreadNotifications()
    {
        return $this->notifications()->whereNull('read_at');
    }

    public function receivesBroadcastNotificationsOn(): string
    {
        return "user.{$this->id}";
    }
}
