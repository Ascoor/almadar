<?php

namespace App\Events;

use App\Enums\AssignmentStatus;
use App\Models\Assignment;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AssignmentStatusUpdated
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public Assignment $assignment, public AssignmentStatus $previousStatus, public User $actor)
    {
    }
}
