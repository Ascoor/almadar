<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Archive;
use App\Services\AssignmentService;
use App\Helpers\AdminNotifier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ContractController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view contracts')->only(['index', 'show']);
        $this->middleware('permission:create contracts')->only('store');
        $this->middleware('permission:edit contracts')->only('update');
        $this->middleware('permission:delete contracts')->only('destroy');
    }

    public function index()
    {
        $contracts = Contract::query()
            ->with([
                'category',
                'creator',
                'updater',
                'assignedTo',
            ])
            ->latest()
            ->paginate(50);

        return response()->json($contracts);
    }

    public function show($id)
    {
        $contract = Contract::query()
            ->with([
                'category',
                'creator',
                'updater',
                'assignedTo',
            ])
            ->findOrFail($id);

        return response()->json($contract);
    }

    public function store(Request $request)
    {
        $validated = $this->validateContract($request);

        // assignment comes separately (we do it with AssignmentService)
        $assigneeId = $validated['assigned_to_user_id'] ?? null;
        unset($validated['assigned_to_user_id']);

        $validated['value'] = $this->normalizeValue($validated['value'] ?? null);

        // ✅ creator/updater
        $userId = auth()->id();
        $validated['created_by'] = $userId;
        $validated['updated_by'] = $userId;

        // attachment (store path only, actual store outside transaction is fine)
        if ($request->hasFile('attachment')) {
            try {
                $validated['attachment'] = $this->storeAttachment(
                    $request->file('attachment'),
                    $validated['scope']
                );
            } catch (\Throwable $e) {
                $this->logAttachmentError($e);
                return $this->attachmentErrorResponse();
            }
        }

        $contract = null;

        DB::transaction(function () use (&$contract, $validated, $assigneeId, $userId) {
            $contract = Contract::create($validated);

            // ✅ assignment notification
            AssignmentService::apply($contract, $assigneeId, 'contracts', 'number');

            // ✅ archive if attachment exists
            if (!empty($contract->attachment)) {
                $this->storeArchive($contract);
            }

            // ✅ notify admins
            AdminNotifier::notifyAll(
                '📄 عقد جديد',
                'تمت إضافة عقد رقم: ' . $contract->number . ' بواسطة ' . (auth()->user()->name ?? 'System'),
                "/contracts/{$contract->getKey()}",
                $userId
            );
        });

        return response()->json([
            'message'  => 'تم إنشاء العقد بنجاح.',
            'contract' => $contract->load(['category', 'creator:id,name', 'updater:id,name', 'assignedTo:id,name']),
        ], 201);
    }

    public function update(Request $request, Contract $contract)
    {
        $validated = $this->validateContract($request, $contract->getKey());

        $assigneeId = $validated['assigned_to_user_id'] ?? null;
        unset($validated['assigned_to_user_id']);

        $validated['value'] = $this->normalizeValue($validated['value'] ?? null);

        // ✅ updater
        $userId = auth()->id();
        $validated['updated_by'] = $userId;

        // handle attachment replacement
        $newAttachmentPath = null;
        $shouldReplaceAttachment = $request->hasFile('attachment');

        if ($shouldReplaceAttachment) {
            try {
                $newAttachmentPath = $this->storeAttachment(
                    $request->file('attachment'),
                    $validated['scope'] ?? $contract->scope
                );
                $validated['attachment'] = $newAttachmentPath;
            } catch (\Throwable $e) {
                $this->logAttachmentError($e);
                return $this->attachmentErrorResponse();
            }
        }

        DB::transaction(function () use ($contract, $validated, $assigneeId, $userId) {
            $contract->update($validated);

            // ✅ assignment notification (only to assignee)
            AssignmentService::apply($contract, $assigneeId, 'contracts', 'number');

            // ✅ archive if attachment exists
            if (!empty($contract->attachment)) {
                $this->storeArchive($contract);
            }

            // ✅ notify admins
            AdminNotifier::notifyAll(
                '✏️ تعديل عقد',
                'تم تعديل عقد رقم: ' . $contract->number . ' بواسطة ' . (auth()->user()->name ?? 'System'),
                "/contracts/{$contract->getKey()}",
                $userId
            );
        });

        // ✅ delete old attachment AFTER transaction success
        if ($shouldReplaceAttachment && $newAttachmentPath) {
            $this->deleteOldAttachment($contract->getOriginal('attachment'));
        }

        return response()->json([
            'message'  => 'تم تحديث العقد بنجاح.',
            'contract' => $contract->fresh()->load(['category', 'creator:id,name', 'updater:id,name', 'assignedTo:id,name']),
        ]);
    }

    public function destroy(Contract $contract)
    {
        $this->deleteOldAttachment($contract->attachment);
        $contract->delete();

        return response()->json(['message' => 'تم حذف العقد بنجاح.']);
    }

    public function assign(Request $request, Contract $contract)
    {
        $data = $request->validate([
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);

        AssignmentService::apply($contract, $data['assigned_to_user_id'] ?? null, 'contracts', 'number');

        return response()->json([
            'message'  => 'تم تحديث الإسناد.',
            'contract' => $contract->fresh()->load(['assignedTo:id,name']),
        ]);
    }

    // -----------------
    // Helpers
    // -----------------

    private function validateContract(Request $request, $contractId = null): array
    {
        $uniqueRule = 'unique:contracts,number';
        if ($contractId) {
            $uniqueRule .= ',' . $contractId;
        }

        return $request->validate([
            'contract_category_id' => 'required|exists:contract_categories,id',
            'scope'                => 'required|in:local,international',
            'number'               => ['required', 'string', $uniqueRule],
            'contract_parties'     => 'required|string',
            'value'                => 'nullable|numeric',
            'start_date'           => 'nullable|date',
            'end_date'             => 'nullable|date|after_or_equal:start_date',
            'notes'                => 'nullable|string',
            'status'               => 'required|in:active,expired,terminated,pending,cancelled',
            'summary'              => 'nullable|string',
            'assigned_to_user_id'  => 'nullable|exists:users,id',
            'attachment'           => 'nullable|file|mimes:pdf|max:5120',
        ]);
    }

    private function normalizeValue($value): ?float
    {
        return $value !== null ? (float) $value : null;
    }

    private function storeAttachment($file, string $scope): string
    {
        $folder = "attachments/contracts/{$scope}";

        if (!Storage::disk('public')->exists($folder)) {
            Storage::disk('public')->makeDirectory($folder, 0755, true);
        }

        return $file->store($folder, 'public');
    }

    private function deleteOldAttachment(?string $attachmentPath): void
    {
        if ($attachmentPath && Storage::disk('public')->exists($attachmentPath)) {
            Storage::disk('public')->delete($attachmentPath);
        }
    }

    private function logAttachmentError(\Throwable $e): void
    {
        Log::error('Attachment upload failed.', [
            'error' => $e->getMessage(),
            'file'  => $e->getFile(),
            'line'  => $e->getLine(),
        ]);
    }

    private function attachmentErrorResponse()
    {
        return response()->json([
            'message' => 'فشل رفع المرفق. راجع سجل الأخطاء.',
            'errors'  => ['attachment' => ['فشل رفع المرفق.']],
        ], 422);
    }

    private function storeArchive(Contract $contract): void
    {
        if (!$contract->attachment) return;

        Archive::create([
            'model_type'     => 'Contract',
            'model_id'       => $contract->getKey(),
            'title'          => ($contract->category?->name ?? 'Contract') . ' - ' . ($contract->scope === 'local' ? 'محلي' : 'دولي'),
            'number'         => $contract->number,
            'file_path'      => $contract->attachment,
            'extracted_text' => $contract->contract_parties,
        ]);
    }
}
