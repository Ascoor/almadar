<?php

namespace App\Http\Controllers;

use App\Models\LegalAdvice;
use App\Models\Archive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Helpers\AdminNotifier;
use App\Services\AssignmentService;

class LegalAdviceController extends Controller
{
                 public function __construct()
        {
        $this->middleware('permission:view legaladvices')->only(['index','show']);
        $this->middleware('permission:create legaladvices')->only('store');
        $this->middleware('permission:edit legaladvices')->only('update');
        $this->middleware('permission:delete legaladvices')->only('destroy');
    }
    /**
     * Display a listing of all legal advices (with their types eager‐loaded).
     */
    public function index()
    {
        $legalAdvices = LegalAdvice::with('adviceType','updater','creator')->get();
        return response()->json($legalAdvices);
    }

    /**
     * Store a newly created LegalAdvice in storage.
     */
    public function store(Request $request)
    {
        // 1) Validate all incoming fields
        $validated = $this->validateAdvice($request);
        $assigneeId = $validated['assigned_to_user_id'] ?? null;
        unset($validated['assigned_to_user_id']);

        // 2) If there's an uploaded PDF, save it to storage and record the path in $validated
        if ($request->hasFile('attachment')) {
            try {
                $validated['attachment'] = $this->storeAttachment($request->file('attachment'));
            } catch (\Exception $e) {
                $this->logAttachmentError($e);
                return $this->attachmentErrorResponse();
            }
        }

        // 3) Record who created this advice
        $validated['created_by'] = auth()->id();

        // 4) Create the new LegalAdvice
        $advice = LegalAdvice::create($validated);

        AssignmentService::apply($advice, $assigneeId, 'legal_advice', 'topic');

        // 5) If we did upload a PDF, store an Archive record
        if (!empty($validated['attachment'])) {
            $this->storeArchive($advice);
        }

        // 6) Notify all admins in real‐time (and save in notifications table)
        AdminNotifier::notifyAll(
            '📄 مشورة جديدة',
            'تمت إضافة مشورة بعنوان: ' . $advice->topic,
            '/legal-advices/' . $advice->id,
     auth()->id()
        );

        // 7) Return JSON response
        return response()->json([
            'message' => 'تم إنشاء المشورة بنجاح.',
            'advice'  => $advice,
        ], 201);
    }

    /**
     * Update an existing LegalAdvice.
     */
    public function update(Request $request, LegalAdvice $legalAdvice)
    {
        // 1) Validate except we pass the current ID so unique rule for advice_number is correct
        $validated = $this->validateAdvice($request, $legalAdvice->id);
        $assigneeId = $validated['assigned_to_user_id'] ?? null;
        unset($validated['assigned_to_user_id']);

        // 2) If there's a new PDF, delete the old one & save the new one
        if ($request->hasFile('attachment')) {
            try {
                $this->deleteOldAttachment($legalAdvice->attachment);
                $validated['attachment'] = $this->storeAttachment($request->file('attachment'));
            } catch (\Exception $e) {
                $this->logAttachmentError($e);
                return $this->attachmentErrorResponse();
            }
        }

        // 3) Record who updated
        $validated['updated_by'] = auth()->id();

        // 4) Apply update
        $legalAdvice->update($validated);

        AssignmentService::apply($legalAdvice, $assigneeId, 'legal_advice', 'topic');

        // 5) If a fresh PDF was uploaded, store a new archive record
        if (!empty($validated['attachment'])) {
            $this->storeArchive($legalAdvice);
        }

        // 6) Notify admins
        AdminNotifier::notifyAll(
            '✏️ تعديل مشورة',
            'تم تعديل مشورة بعنوان: ' . $legalAdvice->topic,
            '/legal-advices/' . $legalAdvice->id,
     auth()->id()
        );

        // 7) Return JSON
        return response()->json([
            'message' => 'تم تحديث المشورة بنجاح.',
            'advice'  => $legalAdvice,
        ]);
    }

    /**
     * Remove (delete) a LegalAdvice.
     */
    public function destroy(LegalAdvice $legalAdvice)
    {
        // 1) Delete the existing PDF from storage (if any)
        $this->deleteOldAttachment($legalAdvice->attachment);

        // 2) Delete the record
        $legalAdvice->delete();

        // 3) Return JSON confirmation
        return response()->json([
            'message' => 'تم حذف المشورة بنجاح.',
        ]);
    }

    public function assign(Request $request, LegalAdvice $legalAdvice)
    {
        $data = $request->validate([
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);

        AssignmentService::apply($legalAdvice, $data['assigned_to_user_id'] ?? null, 'legal_advice', 'topic');

        return response()->json([
            'message' => 'تم تحديث إسناد المشورة.',
            'advice' => $legalAdvice->fresh('assignedTo'),
        ]);
    }

    /**
     * Show a single LegalAdvice’s details.
     */
    public function show(LegalAdvice $legalAdvice)
    {
        return response()->json($legalAdvice);
    }

    // ------------------------------------------------------------------------
    // ───────────────────────────────────────────────────────────────────────
    //                              HELPER METHODS
    // ───────────────────────────────────────────────────────────────────────
    // ------------------------------------------------------------------------

    /**
     * Validate the request data for store/update.
     * If $id is provided, exclude that record from the unique rule.
     */
    private function validateAdvice(Request $request, $id = null)
    {
        $uniqueRule = 'unique:legal_advices,advice_number';
        if ($id) {
            $uniqueRule .= ',' . $id;
        }

        return $request->validate([
            'advice_type_id'  => 'sometimes|exists:advice_types,id',
            'topic'           => 'required|string|max:255',
            'text'            => 'required|string',
            'requester'       => 'required|string|max:255',
            'issuer'          => 'required|string|max:255',
            'advice_date'     => 'required|date',
            'advice_number'   => ['required', 'string', $uniqueRule],
            'notes'           => 'nullable|string',
            'attachment'      => 'nullable|file|mimes:pdf|max:5120',
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);
    }

    /**
     * Handle storing a PDF attachment under storage/app/public/attachments/legal_advices.
     * Returns the stored path (relative to `storage/app/public`).
     */
    private function storeAttachment($file)
    {
        $folder = 'attachments/legal_advices';

        if (!Storage::disk('public')->exists($folder)) {
            Storage::disk('public')->makeDirectory($folder, 0755, true);
        }

        // Store and return the path, e.g. "attachments/legal_advices/abc123.pdf"
        return $file->store($folder, 'public');
    }

    /**
     * Delete an old attachment from storage (if it exists).
     */
    private function deleteOldAttachment($path)
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Log any errors that occur during attachment upload.
     */
    private function logAttachmentError(\Exception $e)
    {
        Log::error('فشل رفع مرفق المشورة', [
            'error' => $e->getMessage(),
            'file'  => $e->getFile(),
            'line'  => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ]);
    }

    /**
     * Return a standardized JSON error response if attachment upload fails.
     */
    private function attachmentErrorResponse()
    {
        return response()->json([
            'message' => 'حدث خطأ أثناء رفع المرفق.',
            'errors'  => ['attachment' => ['فشل رفع الملف.']],
        ], 422);
    }

    /**
     * Store a new Archive record for this LegalAdvice.
     * – model_type: “LegalAdvice”
     * – model_id: the advice’s ID
     * – title: e.g. “المشورة: <topic>”
     * – file_path: where the PDF was stored
     * – extracted_text: use the advice’s topic (or you could use a short excerpt)
     */
    private function storeArchive(LegalAdvice $advice)
    {
        if (! $advice->attachment) {
            // If for some reason the advice doesn’t actually have an attachment, skip
            return;
        }

        Archive::create([
            'model_type'    => 'LegalAdvice',
            'model_id'      => $advice->id,
            'number'         => $advice->advice_number,
            'title'         => 'المشورة: ' . $advice->topic,
            'file_path'     => $advice->attachment,
            'extracted_text'=> $advice->topic, 
        ]);
    }
}
