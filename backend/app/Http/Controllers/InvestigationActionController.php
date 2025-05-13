<?php

namespace App\Http\Controllers;

use App\Models\Investigation;
use App\Models\InvestigationAction;
use Illuminate\Http\Request;

class InvestigationActionController extends Controller
{
    /**
     * عرض جميع الإجراءات المرتبطة بتحقيق معين.
     */
    public function index(Investigation $investigation)
    {
        $actions = $investigation->actions()->latest()->get();
        return response()->json($actions);
    }

    /**
     * حفظ إجراء جديد مرتبط بتحقيق.
     */
    public function store(Request $request, Investigation $investigation)
    {
        $validated = $request->validate([
            'action_date' => 'required|date',
            'action_type_id' => 'required|exists:investigation_action_types,id', // Validate against investigation_action_types table

            'officer_name' => 'required|string|max:255',
            'requirements' => 'nullable|string',
            'results' => 'nullable|string',
            'status' => 'required|in:pending,in_review,done',
        ]);

        $action = $investigation->actions()->create($validated);

        return response()->json([
            'message' => 'تم إضافة الإجراء بنجاح.',
            'data' => $action,
        ], 201);
    }

    /**
     * عرض إجراء محدد.
     */
    public function show(Investigation $investigation, InvestigationAction $action)
    {
        if ($action->investigation_id !== $investigation->id) {
            return response()->json(['message' => 'الإجراء لا يتبع هذا التحقيق.'], 403);
        }

        return response()->json($action);
    }

    /**
     * تحديث إجراء محدد.
     */public function update(Request $request, Investigation $investigation, InvestigationAction $action)
{
    // التحقق من أن الإجراء ينتمي إلى التحقيق الحالي
    if ($action->investigation_id !== $investigation->id) {
        return response()->json(['message' => 'الإجراء لا يتبع هذا التحقيق.'], 403);
    }

    // التحقق من صحة البيانات المدخلة
    $validated = $request->validate([
        'action_date' => 'sometimes|date',
        'action_type_id' => 'sometimes|exists:investigation_action_types,id', // تحقق من وجود id في الجدول المحدد
        'officer_name' => 'sometimes|string|max:255',
        'requirements' => 'nullable|string',
        'results' => 'nullable|string',
        'status' => 'sometimes|in:pending,in_review,done',
    ]);

    // تحديث الإجراء باستخدام البيانات المدخلة
    $action->update($validated);

    // إرجاع الاستجابة بنجاح مع الإجراء المحدث
    return response()->json([
        'message' => 'تم تحديث الإجراء بنجاح.',
        'data' => $action,
    ]);
}
 
    public function destroy(Investigation $investigation, InvestigationAction $action)
    {
        if ($action->investigation_id !== $investigation->id) {
            return response()->json(['message' => 'الإجراء لا يتبع هذا التحقيق.'], 403);
        }

        $action->delete();

        return response()->json([
            'message' => 'تم حذف الإجراء بنجاح.',
        ]);
    }
}
