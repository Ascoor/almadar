<?php

namespace App\Listeners;

use App\Events\AssignmentCreated;
use App\Events\AssignmentStatusUpdated;
use App\Models\AuditLog;

class RecordAssignmentAuditLog
{
    public function handle(AssignmentCreated|AssignmentStatusUpdated $event): void
    {
        $action = $event instanceof AssignmentCreated ? 'assignment_created' : 'assignment_status_updated';

        AuditLog::create([
            'actor_type' => get_class($event->actor),
            'actor_id' => $event->actor->id,
            'action' => $action,
            'subject_type' => get_class($event->assignment),
            'subject_id' => $event->assignment->id,
            'meta' => $event instanceof AssignmentStatusUpdated ? ['from' => $event->previousStatus->value, 'to' => $event->assignment->status->value] : null,
        ]);
    }
}
