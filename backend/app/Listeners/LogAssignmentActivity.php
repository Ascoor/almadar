<?php

namespace App\Listeners;

use App\Events\AssignmentCreated;
use App\Events\AssignmentStatusUpdated;
use App\Models\AuditLog;

class LogAssignmentActivity
{
    public function handle(AssignmentCreated|AssignmentStatusUpdated $event): void
    {
        $assignment = $event->assignment;
        $actor = auth()->user();
        AuditLog::create([
            'actor_type' => $actor ? $actor::class : null,
            'actor_id' => $actor?->id,
            'action' => $event instanceof AssignmentCreated ? 'assignment_created' : 'assignment_status_updated',
            'subject_type' => $assignment::class,
            'subject_id' => $assignment->id,
            'meta' => [
                'status' => $assignment->status,
                'order_id' => $assignment->order_id,
            ],
        ]);
    }
}
