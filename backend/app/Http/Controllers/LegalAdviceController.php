<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LegalAdvice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class LegalAdviceController extends Controller
{
    public function index()
    {
        //get with advice_type
        $legalAdvices = LegalAdvice::with('adviceType')->get();
        return response()->json($legalAdvices);
    }

    public function store(Request $request)
    {
        $validated = $this->validateAdvice($request);

        if ($request->hasFile('attachment')) {
            try {
                $validated['attachment'] = $this->storeAttachment($request->file('attachment'));
            } catch (\Exception $e) {
                $this->logAttachmentError($e);
                return $this->attachmentErrorResponse();
            }
        }

        $advice = LegalAdvice::create($validated);

        return response()->json([
            'message' => 'تم إنشاء المشورة بنجاح.',
            'advice' => $advice,
        ], 201);
    }

    public function update(Request $request, LegalAdvice $legalAdvice)
    {
        $validated = $this->validateAdvice($request, $legalAdvice->id);

        if ($request->hasFile('attachment')) {
            try {
                $this->deleteOldAttachment($legalAdvice->attachment);
                $validated['attachment'] = $this->storeAttachment($request->file('attachment'));
            } catch (\Exception $e) {
                $this->logAttachmentError($e);
                return $this->attachmentErrorResponse();
            }
        }

        $legalAdvice->update($validated);

        return response()->json([
            'message' => 'تم تحديث المشورة بنجاح.',
            'advice' => $legalAdvice,
        ]);
    }

    public function destroy(LegalAdvice $legalAdvice)
    {
        $this->deleteOldAttachment($legalAdvice->attachment);
        $legalAdvice->delete();

        return response()->json([
            'message' => 'تم حذف المشورة بنجاح.',
        ]);
    }

    public function show(LegalAdvice $legalAdvice)
    {
        return response()->json($legalAdvice);
    }

    // ----------------- Helpers ---------------- //

    private function validateAdvice(Request $request, $id = null)
    {
        $uniqueRule = 'unique:legal_advices,advice_number';
        if ($id) {
            $uniqueRule .= ',' . $id;
        }

        return $request->validate([
 'advice_type_id' => 'sometimes|exists:advice_types,id', // Validate against investigation_action_types table
        
            'topic' => 'required|string|max:255',
            'text' => 'required|string',
            'requester' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'advice_date' => 'required|date',
            'advice_number' => ['required', 'string', $uniqueRule],
            'notes' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:pdf|max:5120',
        ]);
    }

    private function storeAttachment($file)
    {
        $folder = 'attachments/legal_advices';

        if (!Storage::disk('public')->exists($folder)) {
            Storage::disk('public')->makeDirectory($folder, 0755, true);
        }

        return $file->store($folder, 'public');
    }

    private function deleteOldAttachment($path)
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    private function logAttachmentError(\Exception $e)
    {
        Log::error('فشل رفع مرفق المشورة', [
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
        ]);
    }

    private function attachmentErrorResponse()
    {
        return response()->json([
            'message' => 'حدث خطأ أثناء رفع المرفق.',
            'errors' => ['attachment' => ['فشل رفع الملف.']],
        ], 422);
    }
}
