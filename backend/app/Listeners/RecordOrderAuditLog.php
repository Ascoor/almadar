<?php

namespace App\Listeners;

use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Models\AuditLog;

class RecordOrderAuditLog
{
    public function handle(OrderCreated|OrderStatusUpdated $event): void
    {
        $action = $event instanceof OrderCreated ? 'order_created' : 'order_status_updated';

        AuditLog::create([
            'actor_type' => get_class($event->actor),
            'actor_id' => $event->actor->id,
            'action' => $action,
            'subject_type' => get_class($event->order),
            'subject_id' => $event->order->id,
            'meta' => $event instanceof OrderStatusUpdated ? ['from' => $event->previousStatus->value, 'to' => $event->order->status->value] : null,
        ]);
    }
}
