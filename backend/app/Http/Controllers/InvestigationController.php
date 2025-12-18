<?php

namespace App\Http\Controllers;

use App\Models\Investigation;
use Illuminate\Http\Request;
use App\Services\AssignmentService;
use App\Events\EntityActivityRecorded;

class InvestigationController extends Controller
{
    
             public function __construct()
        {
        $this->middleware('permission:view investigations')->only(['index','show']);
        $this->middleware('permission:create investigations')->only('store');
        $this->middleware('permission:edit investigations')->only('update');
        $this->middleware('permission:delete investigations')->only('destroy');
    }
    public function index()
    {
        $investigations = Investigation::with(['actions.actionType', 'assignedTo'])
            ->latest()
            ->paginate(10);
    
        return response()->json($investigations);
    }
    

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_name' => 'required|string|max:255',
            'source'        => 'required|string|max:255',
            'subject'       => 'required|string|max:255',
            'case_number'   => 'nullable|string|max:255',
            'status'        => 'required|in:open,in_progress,closed',
            'notes'         => 'nullable|string',
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);
        $assigneeId = $validated['assigned_to_user_id'] ?? null;
        unset($validated['assigned_to_user_id']);

        $validated['created_by'] = auth()->id();

        $investigation = Investigation::create($validated);

        AssignmentService::apply($investigation, $assigneeId, 'investigations', 'subject');

        event(new EntityActivityRecorded(
            entity: $investigation,
            section: 'investigations',
            event: 'created',
            actorId: auth()->id(),
            actorName: auth()->user()?->name,
            actionUrl: '/investigations/' . $investigation->id,
        ));

        return response()->json([
            'message' => 'تم إنشاء التحقيق بنجاح.',
            'data'    => $investigation,
        ], 201);
    }

    public function show(Investigation $investigation)
    {
        $investigation->load('actions.actionType');
        return response()->json($investigation);
    }

    public function update(Request $request, Investigation $investigation)
    {
        $validated = $request->validate([
            'employee_name' => 'sometimes|string|max:255',
            'source'        => 'sometimes|string|max:255',
            'subject'       => 'sometimes|string|max:255',
            'case_number'   => 'nullable|string|max:255',
            'status'        => 'sometimes|in:open,in_progress,closed',
            'notes'         => 'nullable|string',
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);
        $assigneeId = $validated['assigned_to_user_id'] ?? null;
        unset($validated['assigned_to_user_id']);

        $validated['updated_by'] = auth()->id();

        $investigation->update($validated);

        AssignmentService::apply($investigation, $assigneeId, 'investigations', 'subject');

        event(new EntityActivityRecorded(
            entity: $investigation,
            section: 'investigations',
            event: 'updated',
            actorId: auth()->id(),
            actorName: auth()->user()?->name,
            actionUrl: '/investigations/' . $investigation->id,
        ));

        return response()->json([
            'message' => 'تم تحديث التحقيق بنجاح.',
            'data'    => $investigation,
        ]); 
        }
        
    public function destroy(Investigation $investigation)
    {
        $investigation->delete();

        return response()->json([
            'message' => 'تم حذف التحقيق بنجاح.',
        ]);
    }

    public function assign(Request $request, Investigation $investigation)
    {
        $data = $request->validate([
            'assigned_to_user_id' => 'nullable|exists:users,id',
        ]);

        AssignmentService::apply($investigation, $data['assigned_to_user_id'] ?? null, 'investigations', 'subject');

        return response()->json([
            'message' => 'تم تحديث إسناد التحقيق.',
            'investigation' => $investigation->fresh('assignedTo'),
        ]);
    }
}
