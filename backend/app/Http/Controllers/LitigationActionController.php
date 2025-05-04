<?php

namespace App\Http\Controllers;

use App\Models\Litigation;
use App\Models\LitigationAction;
use Illuminate\Http\Request;

class LitigationActionController extends Controller
{
    public function index(Litigation $litigation)
    {
        $actions = $litigation->actions()->latest()->get();
        return response()->json($actions);
    }

    public function store(Request $request, Litigation $litigation)
    {
        $validated = $this->validateAction($request);
        $action = $litigation->actions()->create($validated);

        return response()->json([
            'message' => 'تم إضافة الإجراء القضائي بنجاح.',
            'data' => $action,
        ], 201);
    }

    public function update(Request $request, Litigation $litigation, LitigationAction $action)
    {
        if ($action->litigation_id !== $litigation->id) {
            return response()->json(['message' => 'الإجراء لا يتبع هذه القضية.'], 403);
        }

        $validated = $this->validateAction($request);
        $action->update($validated);

        return response()->json([
            'message' => 'تم تحديث الإجراء القضائي.',
            'data' => $action,
        ]);
    }

    public function destroy(Litigation $litigation, LitigationAction $action)
    {
        if ($action->litigation_id !== $litigation->id) {
            return response()->json(['message' => 'الإجراء لا يتبع هذه القضية.'], 403);
        }

        $action->delete();

        return response()->json(['message' => 'تم حذف الإجراء القضائي.']);
    }

    private function validateAction(Request $request)
    {
        return $request->validate([
            'action_date' => 'required|date',
            'action_description' => 'required|string|max:1000',
            'result' => 'nullable|string',
            'status' => 'required|in:pending,completed,cancelled',
        ]);
    }
}
