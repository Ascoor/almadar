<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Paid = 'paid';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Canceled = 'canceled';
}
