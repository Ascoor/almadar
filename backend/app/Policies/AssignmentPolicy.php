<?php

namespace App\Policies;

use App\Models\Assignment;
use App\Models\User;

class AssignmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Assignment $assignment): bool
    {
        return $user->hasRole('admin')
            || $assignment->assigned_to_user_id === $user->id
            || $assignment->assigned_by_admin_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Assignment $assignment): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Assignment $assignment): bool
    {
        return $user->hasRole('admin');
    }
}
