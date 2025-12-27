<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Events\EntityActivityRecorded;
use App\Events\AssignmentUpdated;
use App\Events\CommentCreated;
use App\Listeners\SendAdminEntityNotification;
use App\Listeners\SendAssigneeNotification;
use App\Listeners\SendCommentNotification;

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
        EntityActivityRecorded::class => [
            SendAdminEntityNotification::class,
        ],
        AssignmentUpdated::class => [
            SendAssigneeNotification::class,
        ],
        CommentCreated::class => [
            SendCommentNotification::class,
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
