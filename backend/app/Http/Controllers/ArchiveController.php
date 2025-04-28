<?php

namespace App\Http\Controllers;

use App\Models\Archive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\IOFactory;
use Spatie\PdfToText\Pdf;

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
            'model_type' => 'nullable|string', // لو مرتبط بموديل تاني
            'model_id' => 'nullable|integer',
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,docx|max:10240', // 10MB
        ]);

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        $path = $file->store('archives/files', 'public');

        $extractedText = '';

        if ($extension === 'pdf') {
            $extractedText = Pdf::getText(storage_path('app/public/' . $path));
        } elseif ($extension === 'docx') {
            $phpWord = IOFactory::load(storage_path('app/public/' . $path));
            foreach ($phpWord->getSections() as $section) {
                foreach ($section->getElements() as $element) {
                    if (method_exists($element, 'getText')) {
                        $extractedText .= $element->getText() . ' ';
                    }
                }
            }
        }

        $archive = Archive::create([
            'model_type' => $validated['model_type'] ?? null,
            'model_id' => $validated['model_id'] ?? null,
            'title' => $validated['title'],
            'file_path' => $path,
            'extracted_text' => $extractedText,
            'file_type' => $extension === 'pdf' ? 'pdf' : 'word',
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
            // حذف القديم
            if ($archive->file_path && Storage::disk('public')->exists($archive->file_path)) {
                Storage::disk('public')->delete($archive->file_path);
            }

            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            $path = $file->store('archives/files', 'public');

            $extractedText = '';

            if ($extension === 'pdf') {
                $extractedText = Pdf::getText(storage_path('app/public/' . $path));
            } elseif ($extension === 'docx') {
                $phpWord = IOFactory::load(storage_path('app/public/' . $path));
                foreach ($phpWord->getSections() as $section) {
                    foreach ($section->getElements() as $element) {
                        if (method_exists($element, 'getText')) {
                            $extractedText .= $element->getText() . ' ';
                        }
                    }
                }
            }

            $archive->update([
                'file_path' => $path,
                'extracted_text' => $extractedText,
                'file_type' => $extension === 'pdf' ? 'pdf' : 'word',
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
