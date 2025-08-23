<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Archive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Helpers\AdminNotifier;
class ContractController extends Controller
{
        public function __construct()
    {
        $this->middleware('permission:view contracts')->only(['index','show']);
        $this->middleware('permission:create contracts')->only('store');
        $this->middleware('permission:edit contracts')->only('update');
        $this->middleware('permission:delete contracts')->only('destroy');
    }
    public function index()
    {
        $contracts = Contract::with('category','updater','creator')->latest()->paginate(50);
        return response()->json($contracts);
    }

    public function store(Request $request)
    {
        $validated = $this->validateContract($request);

        $validated['value'] = $this->normalizeValue($validated['value']);

        if ($request->hasFile('attachment')) {
            try {
                $validated['attachment'] = $this->storeAttachment($request->file('attachment'), $validated['scope']);
            } catch (\Exception $e) {
                $this->logAttachmentError($e);
                return $this->attachmentErrorResponse();
            }
        }

        $contract = Contract::create($validated);

        // ✅ إضافة إلى جدول الأرشيف إذا تم رفع مرفق
        if (!empty($validated['attachment'])) {
            $this->storeArchive($contract);
        }
// بعد إنشاء العقد:
AdminNotifier::notifyAll(
    '📄 عقد جديد',
    'تمت إضافة عقد رقم: ' . $contract->number . ' بواسطة ' . auth()->user()->name,
    '/contracts/' . $contract->id,
     auth()->id()
);
        return response()->json([
            'message' => 'تم إنشاء العقد بنجاح.',
            'contract' => $contract,
        ], 201);
    }

public function update(Request $request, Contract $contract)
{
    $validated = $this->validateContract($request, $contract->id);

    $validated['value'] = $this->normalizeValue($validated['value']);

    if ($request->hasFile('attachment')) {
        try {
            $this->deleteOldAttachment($contract->attachment);
            $validated['attachment'] = $this->storeAttachment($request->file('attachment'), $validated['scope']);
        } catch (\Exception $e) {
            $this->logAttachmentError($e);
            return $this->attachmentErrorResponse();
        }
    }

    // ✅ سجل من قام بالتعديل
    $validated['updated_by'] = auth()->id();

    $contract->update($validated);

    if (!empty($validated['attachment'])) {
        $this->storeArchive($contract);
    }

    AdminNotifier::notifyAll(
        '✏️ تعديل عقد',
        'تم تعديل عقد رقم: ' . $contract->number . ' بواسطة ' . auth()->user()->name,
        '/contracts/' . $contract->id,
        auth()->id()
    );

    return response()->json([
        'message' => 'تم تحديث العقد بنجاح.',
        'contract' => $contract,
    ]);
}


    public function destroy(Contract $contract)
    {
        $this->deleteOldAttachment($contract->attachment);
        $contract->delete();

        return response()->json([
            'message' => 'تم حذف العقد بنجاح.',
        ]);
    }

    // --- Helpers --- //

    private function validateContract(Request $request, $contractId = null)
    {
        $uniqueRule = 'unique:contracts,number';
        if ($contractId) {
            $uniqueRule .= ',' . $contractId;
        }

        return $request->validate([
            'contract_category_id' => 'required|exists:contract_categories,id',
            'scope' => 'required|in:local,international',
            'number' => ['required', 'string', $uniqueRule],
            'contract_parties' => 'required|string',
            'value' => 'nullable|numeric',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
            'status' => 'required|in:active,expired,terminated,pending,cancelled',
            'summary' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:pdf|max:5120',
        ]);
    }

    private function normalizeValue($value)
    {
        return $value !== null ? (float) $value : null;
    }

    private function storeAttachment($file, $scope)
    {
        $folder = 'attachments/contracts/' . $scope;

        if (!Storage::disk('public')->exists($folder)) {
            Storage::disk('public')->makeDirectory($folder, 0755, true);
        }

        return $file->store($folder, 'public');
    }

    private function deleteOldAttachment($attachmentPath)
    {
        if ($attachmentPath && Storage::disk('public')->exists($attachmentPath)) {
            Storage::disk('public')->delete($attachmentPath);
        }
    }

    private function logAttachmentError(\Exception $e)
    {
        Log::error('Attachment upload failed.', [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ]);
    }

    private function attachmentErrorResponse()
    {
        return response()->json([
            'message' => 'فشل رفع المرفق. راجع سجل الأخطاء.',
            'errors' => ['attachment' => ['فشل رفع المرفق.']],
        ], 422);
    }

    /**
     * ✅ تخزين سجل جديد في جدول الأرشيف
     */
    private function storeArchive(Contract $contract)
    {
        if (!$contract->attachment) {
            return;
        }

        Archive::create([
            'model_type' => 'Contract',
            'model_id' => $contract->id,
            'title' => $contract->category?->name . ' - ' . ($contract->scope === 'local' ? 'محلي' : 'دولي'),
            'number' => $contract->number,
            'file_path' => $contract->attachment,
            'extracted_text' => $contract->contract_parties,
        ]);
    }
}
