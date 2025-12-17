<?php

namespace App\Providers;

use App\Events\AssignmentCreated;
use App\Events\AssignmentStatusUpdated;
use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Listeners\LogAssignmentActivity;
use App\Listeners\LogOrderActivity;
use App\Listeners\NotifyAdmins;
use App\Listeners\NotifyAssignee;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        OrderCreated::class => [
            LogOrderActivity::class,
            NotifyAdmins::class,
        ],
        OrderStatusUpdated::class => [
            LogOrderActivity::class,
            NotifyAdmins::class,
        ],
        AssignmentCreated::class => [
            LogAssignmentActivity::class,
            NotifyAssignee::class,
            NotifyAdmins::class,
        ],
        AssignmentStatusUpdated::class => [
            LogAssignmentActivity::class,
            NotifyAssignee::class,
        ],
    ];

    public function boot(): void
    {
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
