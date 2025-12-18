<?php

namespace App\Services;

use App\Models\User;
use App\Events\AssignmentUpdated;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class AssignmentService
{
    public const CONTEXT_ROLES = [
        'contracts'       => ['admin', 'manager', 'lawyer', 'user'],
        'investigations'  => ['legal_investigator', 'lawyer'],
        'procedures'      => ['legal_investigator', 'lawyer'],
        'legal_advice'    => ['legal_investigator', 'lawyer'],
        'sessions'        => ['lawyer'],
    ];

    public static function validateAssignee(?int $userId, string $context): ?User
    {
        if ($userId === null) return null;

        $allowedRoles = Arr::get(self::CONTEXT_ROLES, $context, []);
        $user = User::findOrFail($userId);

        if (!$user->hasAnyRole($allowedRoles)) {
            abort(422, 'User is not eligible for this assignment');
        }

        return $user;
    }

    public static function apply(Model $entity, ?int $assignedToId, string $context, string $titleField = 'id'): void
    {
        $currentAssignee = $entity->assigned_to_user_id;

        // ✅ لو ما تغيّر الإسناد، لا تعمل شيء
        if ((string)$assignedToId === (string)$currentAssignee) {
            return;
        }

        // ✅ تحقق من صلاحية المُسند إليه (null = فك الإسناد)
        $assignee = $assignedToId ? self::validateAssignee($assignedToId, $context) : null;
        $assignedBy = auth()->id();

        // ✅ تحديث الإسناد فقط (بدون أي أعمدة إضافية)
        $payload = [
            'assigned_to_user_id' => $assignedToId,
        ];

        if ($entity->isFillable('assigned_by_user_id')) {
            $payload['assigned_by_user_id'] = $assignedBy;
        }

        $entity->forceFill($payload)->save();

        // ✅ إذا تم فك الإسناد لا ترسل إشعار
        if (!$assignee) {
            return;
        }

        $title = (string) (data_get($entity, $titleField) ?? class_basename($entity));
        $link  = self::makeLink($context, (int) $entity->id);

        event(new AssignmentUpdated(
            entity: $entity,
            section: $context,
            assignee: $assignee,
            assignedBy: $assignedBy,
            title: $title,
            link: $link,
        ));
    }

    private static function makeLink(string $context, int $id): ?string
    {
        return match ($context) {
            'contracts'       => "/contracts/{$id}",
            'investigations'  => "/legal/investigations/{$id}", // ✅ مطابق للراوت عندك
            'procedures'      => "/legal/investigation-action/{$id}",
            'legal_advice'    => "/legal/legal-advices/{$id}",  // ✅ إذا كان راوتك بهذا الشكل
            'sessions'        => "/sessions/{$id}",
            default           => null,
        };
    }
}
