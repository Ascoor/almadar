<?php

namespace App\Http\Controllers;

use App\Models\Investigation;
use App\Models\Archive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\IOFactory;
use Spatie\PdfToText\Pdf;

class InvestigationController extends Controller
{
    public function index()
    {
        return Investigation::with('employee', 'actions')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'employee_id' => 'nullable|exists:employees,id',
            'description' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:pdf,docx',
        ]);

        $investigation = Investigation::create($validated);

        // معالجة المرفق
        if ($request->hasFile('attachment')) {
            $this->saveArchive($investigation, $request->file('attachment'));
        }

        return response()->json($investigation->load('employee', 'actions'), 201);
    }

    public function show(Investigation $investigation)
    {
        return $investigation->load('employee', 'actions');
    }

    public function update(Request $request, Investigation $investigation)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'employee_id' => 'nullable|exists:employees,id',
            'description' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:pdf,docx',
        ]);

        $investigation->update($validated);

        if ($request->hasFile('attachment')) {
            $this->saveArchive($investigation, $request->file('attachment'));
        }

        return response()->json($investigation->load('employee', 'actions'), 200);
    }

    public function destroy(Investigation $investigation)
    {
        $investigation->delete();
        return response()->json(null, 204);
    }

    /**
     * حفظ المرفق بالأرشيف
     */
    protected function saveArchive(Investigation $investigation, $file)
    {
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

        Archive::create([
            'model_type' => Investigation::class,
            'model_id' => $investigation->id,
            'title' => $investigation->title,
            'file_path' => $path,
            'extracted_text' => $extractedText,
            'file_type' => $extension === 'pdf' ? 'pdf' : 'word',
        ]);
    }
}
