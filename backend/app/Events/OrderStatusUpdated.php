<?php

namespace App\Events;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdated
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public Order $order, public OrderStatus $previousStatus, public User $actor)
    {
    }
}
