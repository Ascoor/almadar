    private function getModuleMeta(string $module): array
    {
        $meta = Arr::get(self::MODULES, $module);
        abort_if(!$meta, 404, 'Unknown module');

        return $meta;
    }

    private function canAccess(?User $user, array $permissions, string $action): bool
    {
        return collect($permissions)->contains(
            fn ($perm) => $user?->can("{$action} {$perm}")
        );
    }

    private function determineRecipients(Model $entity, User $actor): Collection
    {
        // القاعدة: إذا المعلّق Admin → الإشعار يذهب للمسند إليه
        if ($this->isAdmin($actor)) {
            return collect($entity->assignedTo ? [$entity->assignedTo] : [])->filter();
        }

        // إذا المعلّق مستخدم عادي → الإشعار يذهب للأدمن
        return User::role('admin')->get();
    }

    private function formatCommentForViewer(Comment $comment, ?User $viewer): array
    {
        $receipt = $viewer ? $this->resolveVisibleReceipt($comment, $viewer) : null;

        $base = Arr::except($comment->toArray(), ['receipts']);

        return array_merge($base, [
            'receipt' => $receipt ? [
                'recipient_id' => $receipt->recipient_id,
                'delivered_at' => optional($receipt->delivered_at)->toISOString(),
                'read_at' => optional($receipt->read_at)->toISOString(),
            ] : null,
        ]);
    }

    private function resolveVisibleReceipt(Comment $comment, User $viewer): ?CommentReceipt
    {
        // 1) لو المشاهد هو المستلم: يرجع receipt الخاص به
        $receiptForViewer = $comment->receipts->first(
            fn (CommentReceipt $receipt) => $receipt->recipient_id === $viewer->id
        );

        if ($receiptForViewer) {
            return $receiptForViewer;
        }

        // 2) لو المشاهد هو كاتب التعليق: يعرض أول receipt (حالة المستلم المقابل)
        if ($comment->user_id === $viewer->id) {
            return $comment->receipts->first();
        }

        // 3) لو Admin: يعرض أول receipt (للمراقبة/المتابعة)
        if ($this->isAdmin($viewer)) {
            return $comment->receipts->first();
        }

        // غير ذلك لا نعرض receipts (خصوصية)
        return null;
    }

    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('Admin');
    }

    public function markAsRead(?string $module, ?int $id, array $commentIds, User $user): void
    {
        $receiptQuery = CommentReceipt::query()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at');

        if ($module && $id) {
            $entity = $this->resolveCommentable($module, $id, 'view');
            $ids = $entity->comments()->pluck('id');
            $receiptQuery->whereIn('comment_id', $ids);
        }

        if (!empty($commentIds)) {
            $receiptQuery->whereIn('comment_id', $commentIds);
        }

        $receiptQuery->update(['read_at' => now()]);
    }
    private function getModuleMeta(string $module): array
    {
        $meta = Arr::get(self::MODULES, $module);
        abort_if(!$meta, 404, 'Unknown module');

        return $meta;
    }

    private function canAccess(?User $user, array $permissions, string $action): bool
    {
        return collect($permissions)->contains(
            fn ($perm) => $user?->can("{$action} {$perm}")
        );
    }

    private function determineRecipients(Model $entity, User $actor): Collection
    {
        // القاعدة: إذا المعلّق Admin → الإشعار يذهب للمسند إليه
        if ($this->isAdmin($actor)) {
            return collect($entity->assignedTo ? [$entity->assignedTo] : [])->filter();
        }

        // إذا المعلّق مستخدم عادي → الإشعار يذهب للأدمن
        return User::role('admin')->get();
    }

    private function formatCommentForViewer(Comment $comment, ?User $viewer): array
    {
        $receipt = $viewer ? $this->resolveVisibleReceipt($comment, $viewer) : null;

        $base = Arr::except($comment->toArray(), ['receipts']);

        return array_merge($base, [
            'receipt' => $receipt ? [
                'recipient_id' => $receipt->recipient_id,
                'delivered_at' => optional($receipt->delivered_at)->toISOString(),
                'read_at' => optional($receipt->read_at)->toISOString(),
            ] : null,
        ]);
    }

    private function resolveVisibleReceipt(Comment $comment, User $viewer): ?CommentReceipt
    {
        // 1) لو المشاهد هو المستلم: يرجع receipt الخاص به
        $receiptForViewer = $comment->receipts->first(
            fn (CommentReceipt $receipt) => $receipt->recipient_id === $viewer->id
        );

        if ($receiptForViewer) {
            return $receiptForViewer;
        }

        // 2) لو المشاهد هو كاتب التعليق: يعرض أول receipt (حالة المستلم المقابل)
        if ($comment->user_id === $viewer->id) {
            return $comment->receipts->first();
        }

        // 3) لو Admin: يعرض أول receipt (للمراقبة/المتابعة)
        if ($this->isAdmin($viewer)) {
            return $comment->receipts->first();
        }

        // غير ذلك لا نعرض receipts (خصوصية)
        return null;
    }

    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('Admin');
    }

    public function markAsRead(?string $module, ?int $id, array $commentIds, User $user): void
    {
        $receiptQuery = CommentReceipt::query()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at');

        if ($module && $id) {
            $entity = $this->resolveCommentable($module, $id, 'view');
            $ids = $entity->comments()->pluck('id');
            $receiptQuery->whereIn('comment_id', $ids);
        }

        if (!empty($commentIds)) {
            $receiptQuery->whereIn('comment_id', $commentIds);
        }

        $receiptQuery->update(['read_at' => now()]);
    }
    private function getModuleMeta(string $module): array
    {
        $meta = Arr::get(self::MODULES, $module);
        abort_if(!$meta, 404, 'Unknown module');

        return $meta;
    }

    private function canAccess(?User $user, array $permissions, string $action): bool
    {
        return collect($permissions)->contains(
            fn ($perm) => $user?->can("{$action} {$perm}")
        );
    }

    private function determineRecipients(Model $entity, User $actor): Collection
    {
        // القاعدة: إذا المعلّق Admin → الإشعار يذهب للمسند إليه
        if ($this->isAdmin($actor)) {
            return collect($entity->assignedTo ? [$entity->assignedTo] : [])->filter();
        }

        // إذا المعلّق مستخدم عادي → الإشعار يذهب للأدمن
        return User::role('admin')->get();
    }

    private function formatCommentForViewer(Comment $comment, ?User $viewer): array
    {
        $receipt = $viewer ? $this->resolveVisibleReceipt($comment, $viewer) : null;

        $base = Arr::except($comment->toArray(), ['receipts']);

        return array_merge($base, [
            'receipt' => $receipt ? [
                'recipient_id' => $receipt->recipient_id,
                'delivered_at' => optional($receipt->delivered_at)->toISOString(),
                'read_at' => optional($receipt->read_at)->toISOString(),
            ] : null,
        ]);
    }

    private function resolveVisibleReceipt(Comment $comment, User $viewer): ?CommentReceipt
    {
        // 1) لو المشاهد هو المستلم: يرجع receipt الخاص به
        $receiptForViewer = $comment->receipts->first(
            fn (CommentReceipt $receipt) => $receipt->recipient_id === $viewer->id
        );

        if ($receiptForViewer) {
            return $receiptForViewer;
        }

        // 2) لو المشاهد هو كاتب التعليق: يعرض أول receipt (حالة المستلم المقابل)
        if ($comment->user_id === $viewer->id) {
            return $comment->receipts->first();
        }

        // 3) لو Admin: يعرض أول receipt (للمراقبة/المتابعة)
        if ($this->isAdmin($viewer)) {
            return $comment->receipts->first();
        }

        // غير ذلك لا نعرض receipts (خصوصية)
        return null;
    }

    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('Admin');
    }

    public function markAsRead(?string $module, ?int $id, array $commentIds, User $user): void
    {
        $receiptQuery = CommentReceipt::query()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at');

        if ($module && $id) {
            $entity = $this->resolveCommentable($module, $id, 'view');
            $ids = $entity->comments()->pluck('id');
            $receiptQuery->whereIn('comment_id', $ids);
        }

        if (!empty($commentIds)) {
            $receiptQuery->whereIn('comment_id', $commentIds);
        }

        $receiptQuery->update(['read_at' => now()]);
    }
    private function getModuleMeta(string $module): array
    {
        $meta = Arr::get(self::MODULES, $module);
        abort_if(!$meta, 404, 'Unknown module');

        return $meta;
    }

    private function canAccess(?User $user, array $permissions, string $action): bool
    {
        return collect($permissions)->contains(
            fn ($perm) => $user?->can("{$action} {$perm}")
        );
    }

    private function determineRecipients(Model $entity, User $actor): Collection
    {
        // القاعدة: إذا المعلّق Admin → الإشعار يذهب للمسند إليه
        if ($this->isAdmin($actor)) {
            return collect($entity->assignedTo ? [$entity->assignedTo] : [])->filter();
        }

        // إذا المعلّق مستخدم عادي → الإشعار يذهب للأدمن
        return User::role('admin')->get();
    }

    private function formatCommentForViewer(Comment $comment, ?User $viewer): array
    {
        $receipt = $viewer ? $this->resolveVisibleReceipt($comment, $viewer) : null;

        $base = Arr::except($comment->toArray(), ['receipts']);

        return array_merge($base, [
            'receipt' => $receipt ? [
                'recipient_id' => $receipt->recipient_id,
                'delivered_at' => optional($receipt->delivered_at)->toISOString(),
                'read_at' => optional($receipt->read_at)->toISOString(),
            ] : null,
        ]);
    }

    private function resolveVisibleReceipt(Comment $comment, User $viewer): ?CommentReceipt
    {
        // 1) لو المشاهد هو المستلم: يرجع receipt الخاص به
        $receiptForViewer = $comment->receipts->first(
            fn (CommentReceipt $receipt) => $receipt->recipient_id === $viewer->id
        );

        if ($receiptForViewer) {
            return $receiptForViewer;
        }

        // 2) لو المشاهد هو كاتب التعليق: يعرض أول receipt (حالة المستلم المقابل)
        if ($comment->user_id === $viewer->id) {
            return $comment->receipts->first();
        }

        // 3) لو Admin: يعرض أول receipt (للمراقبة/المتابعة)
        if ($this->isAdmin($viewer)) {
            return $comment->receipts->first();
        }

        // غير ذلك لا نعرض receipts (خصوصية)
        return null;
    }

    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('Admin');
    }

    public function markAsRead(?string $module, ?int $id, array $commentIds, User $user): void
    {
        $receiptQuery = CommentReceipt::query()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at');

        if ($module && $id) {
            $entity = $this->resolveCommentable($module, $id, 'view');
            $ids = $entity->comments()->pluck('id');
            $receiptQuery->whereIn('comment_id', $ids);
        }

        if (!empty($commentIds)) {
            $receiptQuery->whereIn('comment_id', $commentIds);
        }

        $receiptQuery->update(['read_at' => now()]);
    }
    private function getModuleMeta(string $module): array
    {
        $meta = Arr::get(self::MODULES, $module);
        abort_if(!$meta, 404, 'Unknown module');

        return $meta;
    }

    private function canAccess(?User $user, array $permissions, string $action): bool
    {
        return collect($permissions)->contains(
            fn ($perm) => $user?->can("{$action} {$perm}")
        );
    }

    private function determineRecipients(Model $entity, User $actor): Collection
    {
        // القاعدة: إذا المعلّق Admin → الإشعار يذهب للمسند إليه
        if ($this->isAdmin($actor)) {
            return collect($entity->assignedTo ? [$entity->assignedTo] : [])->filter();
        }

        // إذا المعلّق مستخدم عادي → الإشعار يذهب للأدمن
        return User::role('admin')->get();
    }

    private function formatCommentForViewer(Comment $comment, ?User $viewer): array
    {
        $receipt = $viewer ? $this->resolveVisibleReceipt($comment, $viewer) : null;

        $base = Arr::except($comment->toArray(), ['receipts']);

        return array_merge($base, [
            'receipt' => $receipt ? [
                'recipient_id' => $receipt->recipient_id,
                'delivered_at' => optional($receipt->delivered_at)->toISOString(),
                'read_at' => optional($receipt->read_at)->toISOString(),
            ] : null,
        ]);
    }

    private function resolveVisibleReceipt(Comment $comment, User $viewer): ?CommentReceipt
    {
        // 1) لو المشاهد هو المستلم: يرجع receipt الخاص به
        $receiptForViewer = $comment->receipts->first(
            fn (CommentReceipt $receipt) => $receipt->recipient_id === $viewer->id
        );

        if ($receiptForViewer) {
            return $receiptForViewer;
        }

        // 2) لو المشاهد هو كاتب التعليق: يعرض أول receipt (حالة المستلم المقابل)
        if ($comment->user_id === $viewer->id) {
            return $comment->receipts->first();
        }

        // 3) لو Admin: يعرض أول receipt (للمراقبة/المتابعة)
        if ($this->isAdmin($viewer)) {
            return $comment->receipts->first();
        }

        // غير ذلك لا نعرض receipts (خصوصية)
        return null;
    }

    private function isAdmin(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('Admin');
    }

    public function markAsRead(?string $module, ?int $id, array $commentIds, User $user): void
    {
        $receiptQuery = CommentReceipt::query()
            ->where('recipient_id', $user->id)
            ->whereNull('read_at');

        if ($module && $id) {
            $entity = $this->resolveCommentable($module, $id, 'view');
            $ids = $entity->comments()->pluck('id');
            $receiptQuery->whereIn('comment_id', $ids);
        }

        if (!empty($commentIds)) {
            $receiptQuery->whereIn('comment_id', $commentIds);
        }

        $receiptQuery->update(['read_at' => now()]);
    }
