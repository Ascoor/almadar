<?php

namespace App\Http\Controllers\Api;

use App\Enums\AssignmentStatus;
use App\Events\AssignmentCreated;
use App\Events\AssignmentStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\AssignmentStoreRequest;
use App\Http\Requests\AssignmentUpdateRequest;
use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Assignment::class);
        $query = Assignment::with(['order', 'assignee', 'assigner']);
        if (!$request->user()->hasRole('admin')) {
            $query->where('assigned_to_user_id', $request->user()->id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('assigned_to_user_id')) {
            $query->where('assigned_to_user_id', $request->input('assigned_to_user_id'));
        }
        if ($request->filled('due_date')) {
            $query->whereDate('due_date', $request->input('due_date'));
        }
        if ($request->filled('sort')) {
            $direction = str_starts_with($request->string('sort'), '-') ? 'desc' : 'asc';
            $column = ltrim($request->string('sort'), '-');
            $query->orderBy($column, $direction);
        }
        $assignments = $query->paginate();
        return AssignmentResource::collection($assignments);
    }

    public function store(AssignmentStoreRequest $request)
    {
        $this->authorize('create', Assignment::class);
        $data = $request->validated();
        $order = Order::findOrFail($data['order_id']);
        if (in_array($order->status->value, [AssignmentStatus::Completed->value, AssignmentStatus::Canceled->value])) {
            abort(422, 'لا يمكن تكليف طلب منتهي أو ملغي');
        }
        $assignment = DB::transaction(function () use ($data, $order) {
            $assignment = Assignment::create($data);
            event(new AssignmentCreated($assignment->load(['order', 'assignee', 'assigner'])));
            return $assignment;
        });
        return new AssignmentResource($assignment->load(['order', 'assignee', 'assigner']));
    }

    public function show(Assignment $assignment)
    {
        $this->authorize('view', $assignment);
        $assignment->load(['order', 'assignee', 'assigner']);
        return new AssignmentResource($assignment);
    }

    public function update(AssignmentUpdateRequest $request, Assignment $assignment)
    {
        $this->authorize('update', $assignment);
        $data = $request->validated();
        $assignment = DB::transaction(function () use ($assignment, $data) {
            $assignment->update($data);
            if (array_key_exists('status', $data)) {
                event(new AssignmentStatusUpdated($assignment->load(['order', 'assignee', 'assigner'])));
            }
            return $assignment;
        });
        return new AssignmentResource($assignment->load(['order', 'assignee', 'assigner']));
    }

    public function destroy(Assignment $assignment)
    {
        $this->authorize('delete', $assignment);
        $assignment->delete();
        return response()->noContent();
    }
}
