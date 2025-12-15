<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class AssignmentService
{
    /**
     * Allowed roles by context.
     */
    public const CONTEXT_ROLES = [
        'contracts' => ['admin', 'manager', 'lawyer', 'user'],
        'investigations' => ['legal_investigator', 'lawyer'],
        'procedures' => ['legal_investigator', 'lawyer'],
        'legal_advice' => ['legal_investigator', 'lawyer'],
        'sessions' => ['lawyer'],
    ];

    /**
     * Validate an assignee id for the provided context and return the User instance.
     */
    public static function validateAssignee(?int $userId, string $context): ?User
    {
        if ($userId === null) {
            return null;
        }

        $allowedRoles = Arr::get(self::CONTEXT_ROLES, $context, []);
        $user = User::findOrFail($userId);

        if (!$user->hasAnyRole($allowedRoles)) {
            abort(422, 'User is not eligible for this assignment');
        }

        return $user;
    }

    /**
     * Apply assignment changes and trigger notification when changed.
     */
    public static function apply(Model $entity, ?int $assignedToId, string $context, string $titleField = 'id'): void
    {
        $currentAssignee = $entity->assigned_to_user_id;

        // Validate first
        $assignee = self::validateAssignee($assignedToId, $context);

        if ($assignedToId === $currentAssignee) {
            return;
        }

        $entity->assigned_to_user_id = $assignedToId;
        $entity->assigned_by_user_id = auth()->id();
        $entity->save();

        if ($assignee) {
            Notification::create([
                'user_id' => $assignee->id,
                'title' => __('Assignment updated'),
                'message' => __('You have been assigned to :entity', [
                    'entity' => data_get($entity, $titleField) ?? class_basename($entity),
                ]),
                'link' => null,
                'notifiable_type' => get_class($entity),
                'notifiable_id' => $entity->id,
                'read' => false,
            ]);
        }
    }
}
