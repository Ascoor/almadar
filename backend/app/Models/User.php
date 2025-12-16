<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\DatabaseNotification;

use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles, Notifiable,  HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
           'image',
        'password',
        'password_changed'
    ];
    protected $guard_name = 'api'; 
  protected $with = ['roles', 'permissions']; 
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
       // تعريف العلاقة مع الإشعارات
    
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
