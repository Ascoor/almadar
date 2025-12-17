<?php

namespace App\Providers;

use App\Events\AssignmentCreated;
use App\Events\AssignmentStatusUpdated;
use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Listeners\RecordAssignmentAuditLog;
use App\Listeners\RecordOrderAuditLog;
use App\Listeners\SendAssignmentNotifications;
use App\Listeners\SendOrderNotifications;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        OrderCreated::class => [
            RecordOrderAuditLog::class,
            SendOrderNotifications::class,
        ],
        OrderStatusUpdated::class => [
            RecordOrderAuditLog::class,
            SendOrderNotifications::class,
        ],
        AssignmentCreated::class => [
            RecordAssignmentAuditLog::class,
            SendAssignmentNotifications::class,
        ],
        AssignmentStatusUpdated::class => [
            RecordAssignmentAuditLog::class,
            SendAssignmentNotifications::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
