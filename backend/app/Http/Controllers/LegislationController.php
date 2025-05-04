<?php

namespace App\Http\Controllers;

use App\Models\Legislation;
use App\Models\Archive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\IOFactory;
use Spatie\PdfToText\Pdf;

class LegislationController extends Controller
{
    public function index()
    {
        $legislations  = Legislation::with('actions')->latest()->paginate(10);
        return response()->json($legislations);
    }

    public function show($id)
    {
        $legislation = Legislation::find($id);

        if (!$legislation) {
            return response()->json([
                'status' => false,
                'message' => 'التشريع غير موجود',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $legislation,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'decision_date' => 'required|date',
            'drafting' => 'required|string|max:255',
            'issuing_entity' => 'required|string|max:255',
            'decision_number' => 'required|string|max:100',
            'decision_topic' => 'required|string|max:255',
            'attachment' => 'nullable|file|mimes:pdf,docx|max:5000',
        ]);

        $legislation = Legislation::create($validated);

        if ($request->hasFile('attachment')) {
            $this->saveArchive($legislation, $request->file('attachment'));
        }

        return response()->json([
            'status' => true,
            'message' => 'تم إضافة التشريع مع الأرشفة.',
            'data' => $legislation,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $legislation = Legislation::find($id);

        if (!$legislation) {
            return response()->json([
                'status' => false,
                'message' => 'التشريع غير موجود',
            ], 404);
        }

        $validated = $request->validate([
            'decision_date' => 'sometimes|date',
            'drafting' => 'sometimes|string|max:255',
            'issuing_entity' => 'sometimes|string|max:255',
            'decision_number' => 'sometimes|string|max:100',
            'decision_topic' => 'sometimes|string|max:255',
            'attachment' => 'nullable|file|mimes:pdf,docx|max:5000',
        ]);

        $legislation->update($validated);

        if ($request->hasFile('attachment')) {
            $this->saveArchive($legislation, $request->file('attachment'));
        }

        return response()->json([
            'status' => true,
            'message' => 'تم تحديث التشريع مع الأرشفة.',
            'data' => $legislation,
        ]);
    }

    public function destroy($id)
    {
        $legislation = Legislation::find($id);

        if (!$legislation) {
            return response()->json([
                'status' => false,
                'message' => 'التشريع غير موجود',
            ], 404);
        }

        $legislation->delete();

        return response()->json([
            'status' => true,
            'message' => 'تم حذف التشريع بنجاح.',
        ]);
    }

    /**
     * حفظ المرفق بالأرشيف
     */
    protected function saveArchive(Legislation $legislation, $file)
    {
        $extension = $file->getClientOriginalExtension();
        $path = $file->store('archives/files', 'public');
    
        $extractedText = '';
    
        if ($extension === 'pdf') {
            $extractedText = Pdf::getText(storage_path('app/public/' . $path));
        } elseif ($extension === 'docx') {
            $phpWord = IOFactory::load(storage_path('app/public/' . $path));
            $sections = $phpWord->getSections();
            foreach ($sections as $section) {
                $elements = $section->getElements();
                foreach ($elements as $element) {
                    if (method_exists($element, 'getText')) {
                        $extractedText .= $element->getText() . ' ';
                    } elseif (method_exists($element, 'getElements')) {
                        // لو فيه عناصر داخلية زي الجداول مثلا
                        foreach ($element->getElements() as $subElement) {
                            if (method_exists($subElement, 'getText')) {
                                $extractedText .= $subElement->getText() . ' ';
                            }
                        }
                    }
                }
            }
        }
    
        Archive::create([
            'model_type' => Legislation::class,
            'model_id' => $legislation->id,
            'title' => $legislation->decision_topic,
            'file_path' => $path,
            'extracted_text' => $extractedText,
            'file_type' => $extension === 'pdf' ? 'pdf' : 'word',
        ]);
    }
    
}
