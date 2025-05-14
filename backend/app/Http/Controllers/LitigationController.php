<?php

namespace App\Http\Controllers;

use App\Models\Litigation;
use App\Models\LitigationAction;
use Illuminate\Http\Request;

class LitigationController extends Controller
{
    public function index()
    {

    $litigations = Litigation::with('actions.actionType')->latest()->paginate(15);
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
    try {
        // Delete all related actions first
        $litigation->actions()->delete();

        // Then delete the litigation itself
        $litigation->delete();

        return response()->json([
            'message' => 'تم حذف الدعوى القضائية وجميع الإجراءات التابعة لها بنجاح.'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'حدث خطأ أثناء الحذف.',
            'error' => $e->getMessage()
        ], 500);
    }
}
private function validateLitigation(Request $request)
{
    return $request->validate([
        'scope' => 'required|in:from,against',
        'case_number' => 'required|string|unique:litigations,case_number,' . ($request->id ?? 'null'),
        'case_year' =>'required|string',
        'opponent' => 'required|string|max:255',
        'court' => 'required|string|max:255',
        'filing_date' => 'required|date',
        'subject' => 'required|string|max:255',
        'status' => 'required|in:open,in_progress,closed',
        'results' => 'nullable|string|max:1000',
        'notes' => 'nullable|string|max:1000',
    ]);
}

}
