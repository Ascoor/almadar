<?php

namespace App\Http\Controllers;

use App\Models\Investigation;
use App\Models\InvestigationAction;
use Illuminate\Http\Request;
use App\Services\AssignmentService;
use App\Events\EntityActivityRecorded;

class InvestigationActionController extends Controller
{
    public function index(Investigation $investigation)
    {
        $actions = $investigation->actions()->with(['actionType','assignedTo'])->latest()->get();
        return response()->json($actions);
    }

    public function store(Request $request, Investigation $investigation)
    {
        $validated = $request->validate([
            'action_date'     => 'required|date',
            'action_type_id'  => 'required|exists:investigation_action_types,id', 
            'requirements'    => 'nullable|string',
            'results'         => 'nullable|string',
            'status'          => 'required|in:pending,in_review,done',
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);
        $assigneeId = $validated['assigned_to_user_id'] ?? null;
        unset($validated['assigned_to_user_id']);

        $validated['created_by'] = auth()->id();

        $action = $investigation->actions()->create($validated);

        AssignmentService::apply($action, $assigneeId, 'procedures', 'aassignedTo');

        event(new EntityActivityRecorded(
            entity: $action,
            section: 'investigation-actions',
            event: 'created',
            actorId: auth()->id(),
            actorName: auth()->user()?->name,
            actionUrl: '/investigations/' . $investigation->id,
        ));

        return response()->json([
            'message' => 'تم إضافة الإجراء بنجاح.',
            'data'    => $action,
        ], 201);
    }

    public function showById(InvestigationAction $action)
    {
        $action->load([
            'actionType:id,action_name',
            'assignedTo:id,name',   // إذا عندك هذه العلاقة
            'creator:id,name',
            'updater:id,name',
        ]);
    
        return response()->json(['data' => $action]);
    }
    
    public function show(Investigation $investigation, InvestigationAction $action)
    {
        if ($action->investigation_id !== $investigation->id) {
            return response()->json(['message' => 'الإجراء لا يتبع هذا التحقيق.'], 403);
        }

        return response()->json($action->load('actionType'));
    }

    public function update(Request $request, Investigation $investigation, InvestigationAction $action)
    {
        if ($action->investigation_id !== $investigation->id) {
            return response()->json(['message' => 'الإجراء لا يتبع هذا التحقيق.'], 403);
        }

        $validated = $request->validate([
            'action_date'     => 'sometimes|date',
            'action_type_id'  => 'sometimes|exists:investigation_action_types,id', 
            'requirements'    => 'nullable|string',
            'results'         => 'nullable|string',
            'status'          => 'sometimes|in:pending,in_review,done',
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);
        $assigneeId = $validated['assigned_to_user_id'] ?? null;
        unset($validated['assigned_to_user_id']);

        $validated['updated_by'] = auth()->id();

        $action->update($validated);

        AssignmentService::apply($action, $assigneeId, 'procedures', 'assignedTo');

        event(new EntityActivityRecorded(
            entity: $action,
            section: 'investigation-actions',
            event: 'updated',
            actorId: auth()->id(),
            actorName: auth()->user()?->name,
            actionUrl: '/investigations/' . $investigation->id,
        ));

        return response()->json([
            'message' => 'تم تحديث الإجراء بنجاح.',
            'data'    => $action,
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

    public function assign(Request $request, Investigation $investigation, InvestigationAction $action)
    {
        if ($action->investigation_id !== $investigation->id) {
            return response()->json(['message' => 'الإجراء لا يتبع هذا التحقيق.'], 403);
        }

        $data = $request->validate([
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);

        AssignmentService::apply($action, $data['assigned_to_user_id'] ?? null, 'procedures', 'assignedTo');

        return response()->json([
            'message' => 'تم تحديث إسناد الإجراء.',
            'action' => $action->fresh('assignedTo'),
        ]);
    }
}
