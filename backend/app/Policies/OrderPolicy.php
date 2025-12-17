<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Order $order): bool
    {
        return $user->hasRole('admin') || $order->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('user');
    }

    public function update(User $user, Order $order): bool
    {
        return $user->hasRole('admin') || $order->user_id === $user->id;
    }

    public function delete(User $user, Order $order): bool
    {
        return $user->hasRole('admin');
    }
}
