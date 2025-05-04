<?php

namespace App\Http\Controllers;

use App\Models\Litigation;
use App\Models\LitigationAction;
use Illuminate\Http\Request;

class LitigationController extends Controller
{
    public function index()
    {
        $litigations = Litigation::with('actions')->latest()->paginate(15);
        return response()->json($litigations);
    }

    public function store(Request $request)
    {
        $validated = $this->validateLitigation($request);

        $litigation = Litigation::create($validated);

        return response()->json([
            'message' => 'تم إنشاء القضية بنجاح.',
            'data' => $litigation,
        ], 201);
    }

    public function update(Request $request, Litigation $litigation)
    {
        $validated = $this->validateLitigation($request);
        $litigation->update($validated);

        return response()->json([
            'message' => 'تم تحديث القضية بنجاح.',
            'data' => $litigation,
        ]);
    }

    public function destroy(Litigation $litigation)
    {
        $litigation->delete();

        return response()->json([
            'message' => 'تم حذف القضية بنجاح.',
        ]);
    }

    private function validateLitigation(Request $request)
    {
        return $request->validate([
            'type' => 'required|in:from_company,against_company',
            'case_number' => 'required|string|unique:litigations,case_number,' . $request->id,
            'subject' => 'required|string|max:255',
            'court_name' => 'required|string|max:255',
            'filing_date' => 'required|date',
            'status' => 'required|in:open,closed,pending,in_court',
            'notes' => 'nullable|string',
        ]);
    }
}
