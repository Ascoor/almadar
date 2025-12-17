<?php

namespace App\Providers;

use App\Models\Assignment;
use App\Models\Order;
use App\Models\Service;
use App\Policies\AssignmentPolicy;
use App\Policies\OrderPolicy;
use App\Policies\ServicePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Service::class => ServicePolicy::class,
        Order::class => OrderPolicy::class,
        Assignment::class => AssignmentPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
