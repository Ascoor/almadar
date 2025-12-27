# Phase 0 — Comments & Notifications Audit

## Database / Storage
- `notifications` table already exists via `2014_10_12_000001_create_notifications_table.php` migration (Laravel default).
- Comments storage unified in `comments` table (polymorphic: `commentable_type`, `commentable_id`, `user_id`, `body`, timestamps) defined in `2025_04_26_200000_create_legal_advice_comments_table.php`.

## Existing Functions / Services
- Notification pipeline present with database/broadcast channels:
  - Events: `EntityActivityRecorded`, `AssignmentUpdated`.
  - Listeners: `SendAdminEntityNotification`, `SendAssigneeNotification`.
  - Notifications: `AdminEntityNotification`, `AssigneeNotification`, `AdminAlertNotification`, `AssignmentUpdatedNotification`.
- Assignment helper: `App\Services\AssignmentService` (validates assignees and dispatches `AssignmentUpdated`).
- Notification endpoints already available: `GET /api/notifications`, `PUT /api/notifications/{id}/read`, `PUT /api/notifications/read-all`, `POST /api/notifications/mark-all-read`.
- Authenticated users fetchable via `GET /api/user`.

## Reuse Plan
- Reused Laravel notifications table; no duplicate migrations added.
- Reused event/notification pipeline and assignment helper; extended with `CommentCreated` event + listener to notify assigned users about new comments.
- Unified comments access via `CommentService` over the shared `comments` table for `contracts`, `legal-advices`, `investigations`, and `litigations` with existing permissions (`view/create <module>` patterns).
- Frontend now consumes unified `/api/{module}/{id}/comments` endpoints through a single reusable comments component.
