<?php

namespace App\Http\Controllers;

use App\Models\Litigation;
use App\Models\LitigationAction;
use Illuminate\Http\Request;
use App\Helpers\AdminNotifier;

class LitigationActionController extends Controller
{
    public function index(Litigation $litigation)
    {
        $actions = $litigation->actions()->with(['assigned_to','actionType'])->latest()->paginate(10);
        return response()->json($actions);
    }

    public function store(Request $request, Litigation $litigation)
    {
        $validated = $this->validateAction($request);
        $validated['created_by'] = auth()->id();

        $action = $litigation->actions()->create($validated);

        AdminNotifier::notifyAll(
            '📄 إجراء قضائي جديد',
            'تمت إضافة إجراء على القضية: ' . $litigation->case_number,
            '/litigations/' . $litigation->id,
     auth()->id()
        );

        return response()->json([
            'message' => 'تم إضافة الإجراء القضائي بنجاح.',
            'data'    => $action,
        ], 201);
    }

    public function update(Request $request, Litigation $litigation, LitigationAction $action)
    {
        if ($action->litigation_id !== $litigation->id) {
            return response()->json(['message' => 'الإجراء لا يتبع هذه القضية.'], 403);
        }

        $validated = $this->validateAction($request);
        $validated['updated_by'] = auth()->id();

        $action->update($validated);

        AdminNotifier::notifyAll(
            '✏️ تعديل إجراء قضائي',
            'تم تعديل إجراء في القضية: ' . $litigation->case_number,
            '/litigations/' . $litigation->id,
     auth()->id()
        );

        return response()->json([
            'message' => 'تم تحديث الإجراء القضائي.',
            'data'    => $action,
        ]);
    }

    public function destroy(Litigation $litigation, LitigationAction $action)
    {
        if ($action->litigation_id !== $litigation->id) {
            return response()->json(['message' => 'الإجراء لا يتبع هذه القضية.'], 403);
        }

        $action->delete();

        return response()->json([
            'message' => 'تم حذف الإجراء القضائي.',
        ]);
    }

    private function validateAction(Request $request)
    {
        return $request->validate([
            'action_date'        => 'required|date',
            'action_type_id'     => 'required|exists:litigation_action_types,id',
            'assigned_to_user_id'=> 'required|exists:users,id',
            // اختياري لو تبي تتأكد أنه محامي فقط:
            // 'assigned_to_user_id'=> ['required','exists:users,id', new \App\Rules\UserHasRole('lawyer')],
    
            'requirements'       => 'nullable|string',
            'location'           => 'required|string|max:1000',
            'notes'              => 'nullable|string',
            'results'            => 'nullable|string',
            'status'             => 'required|in:pending,done,in_review',
        ]);
    
    }
}
