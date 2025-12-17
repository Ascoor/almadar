<?php

namespace App\Events;

use App\Models\Assignment;
use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AssignmentCreated
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public Assignment $assignment, public User $actor)
    {
    }
}
