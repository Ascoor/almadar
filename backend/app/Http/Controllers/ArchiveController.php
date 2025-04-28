<?php

namespace App\Http\Controllers;

use App\Models\Archive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArchiveController extends Controller
{
    /**
     * عرض كل الملفات المؤرشفة.
     */
    public function index()
    {
        $archives = Archive::latest()->paginate(20);
        return response()->json($archives);
    }

    /**
     * رفع ملف جديد للأرشيف.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'model_type' => 'nullable|string',
            'model_id' => 'nullable|integer',
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,docx|max:10240', // 10MB
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        $path = $file->store('archives/files', 'public');

        $archive = Archive::create([
            'model_type' => $validated['model_type'] ?? null,
            'model_id' => $validated['model_id'] ?? null,
            'title' => $validated['title'],
            'file_path' => $path,
            'extracted_text' => null, // بدون استخراج نص
        ]);

        return response()->json([
            'message' => 'تم حفظ الملف في الأرشيف بنجاح.',
            'data' => $archive,
        ]);
    }

    /**
     * عرض ملف أرشيف معين.
     */
    public function show(Archive $archive)
    {
        return response()->json($archive);
    }

    /**
     * تحديث بيانات أو ملف داخل الأرشيف.
     */
    public function update(Request $request, Archive $archive)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'file' => 'nullable|file|mimes:pdf,docx|max:10240',
        ]);

        if ($request->hasFile('file')) {
            // حذف الملف القديم إن وجد
            if ($archive->file_path && Storage::disk('public')->exists($archive->file_path)) {
                Storage::disk('public')->delete($archive->file_path);
            }

            // رفع الملف الجديد
            $file = $request->file('file');
            $path = $file->store('archives/files', 'public');

            $archive->update([
                'file_path' => $path,
                'extracted_text' => null, // لا حاجة للنص
            ]);
        }

        if (isset($validated['title'])) {
            $archive->update(['title' => $validated['title']]);
        }

        return response()->json([
            'message' => 'تم تحديث بيانات الأرشيف بنجاح.',
            'data' => $archive,
        ]);
    }

    /**
     * حذف ملف من الأرشيف.
     */
    public function destroy(Archive $archive)
    {
        if ($archive->file_path && Storage::disk('public')->exists($archive->file_path)) {
            Storage::disk('public')->delete($archive->file_path);
        }

        $archive->delete();

        return response()->json([
            'message' => 'تم حذف الملف من الأرشيف بنجاح.',
        ]);
    }
}
