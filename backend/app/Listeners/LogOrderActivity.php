<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Models\AuditLog;

class LogOrderActivity
{
    public function handle(OrderCreated|OrderStatusUpdated $event): void
    {
        $order = $event->order;
        $actor = auth()->user();
        AuditLog::create([
            'actor_type' => $actor ? $actor::class : null,
            'actor_id' => $actor?->id,
            'action' => $event instanceof OrderCreated ? 'order_created' : 'order_status_updated',
            'subject_type' => $order::class,
            'subject_id' => $order->id,
            'meta' => [
                'status' => $order->status,
                'order_number' => $order->order_number,
            ],
        ]);
    }
}
