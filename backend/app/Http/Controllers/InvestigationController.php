<?php

namespace App\Http\Controllers;

use App\Models\Investigation;
use Illuminate\Http\Request;

class InvestigationController extends Controller
{
    public function index()
    {
        $investigations = Investigation::with('actions')->latest()->paginate(10);
        return response()->json($investigations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_name' => 'required|string|max:255',
            'source' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'case_number' => 'nullable|string|max:255',
            'status' => 'required|in:open,in_progress,closed',
            'notes' => 'nullable|string',
        ]);

        $investigation = Investigation::create($validated);

        return response()->json([
            'message' => 'تم إنشاء التحقيق بنجاح.',
            'data' => $investigation,
        ], 201);
    }

    public function show(Investigation $investigation)
    {
        $investigation->load('actions');
        return response()->json($investigation);
    }

    public function update(Request $request, Investigation $investigation)
    {
        $validated = $request->validate([
            'employee_name' => 'sometimes|string|max:255',
            'source' => 'sometimes|string|max:255',
            'subject' => 'sometimes|string|max:255',
            'case_number' => 'nullable|string|max:255',
            'status' => 'sometimes|in:open,in_progress,closed',
            'notes' => 'nullable|string',
        ]);

        $investigation->update($validated);

        return response()->json([
            'message' => 'تم تحديث التحقيق بنجاح.',
            'data' => $investigation,
        ]);
    }

    public function destroy(Investigation $investigation)
    {
        $investigation->delete();

        return response()->json([
            'message' => 'تم حذف التحقيق بنجاح.',
        ]);
    }
}
