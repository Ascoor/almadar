<?php

namespace App\Policies;

use App\Models\LegalAdvice;
use App\Models\User;

class LegalAdvicePolicy
{
    public function view(User $user, LegalAdvice $legalAdvice): bool
    {
        if ($user->data_scope === 'ALL') {
            return true;
        }

        if ($user->data_scope === 'DEPARTMENT') {
            return $legalAdvice->department_id === $user->department_id;
        }

        return $legalAdvice->created_by === $user->id;
    }

    public function update(User $user, LegalAdvice $legalAdvice): bool
    {
        return $this->view($user, $legalAdvice);
    }

    public function delete(User $user, LegalAdvice $legalAdvice): bool
    {
        return $this->view($user, $legalAdvice);
    }
}
