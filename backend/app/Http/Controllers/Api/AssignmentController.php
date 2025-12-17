<?php

namespace App\Http\Controllers\Api;

use App\Enums\AssignmentStatus;
use App\Enums\OrderStatus;
use App\Events\AssignmentCreated;
use App\Events\AssignmentStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\AssignmentStoreRequest;
use App\Http\Requests\AssignmentUpdateRequest;
use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Assignment::class);

        $query = Assignment::with(['order', 'assignee', 'assigner']);

        if (!$request->user()->hasRole('admin')) {
            $query->where('assigned_to_user_id', $request->user()->id);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($request->user()->hasRole('admin') && $request->filled('assigned_to_user_id')) {
            $query->where('assigned_to_user_id', $request->query('assigned_to_user_id'));
        }

        if ($request->filled('due_date')) {
            $query->whereDate('due_date', $request->query('due_date'));
        }

        if ($request->filled('order_id')) {
            $query->where('order_id', $request->query('order_id'));
        }

        $query->orderBy($request->query('sort', 'created_at'), $request->query('direction', 'desc'));

        $assignments = $query->paginate($request->integer('per_page', 15))->withQueryString();

        return AssignmentResource::collection($assignments);
    }

    public function store(AssignmentStoreRequest $request)
    {
        $data = $request->validated();
        $order = Order::with('assignment')->findOrFail($data['order_id']);
        $orderStatus = $order->status?->value ?? $order->status;

        if (in_array($orderStatus, [OrderStatus::Completed->value, OrderStatus::Canceled->value], true)) {
            throw new UnprocessableEntityHttpException('لا يمكن تكليف طلب مكتمل أو ملغى.');
        }

        if ($order->assignment) {
            throw new UnprocessableEntityHttpException('تم تعيين هذا الطلب بالفعل.');
        }

        $assignee = User::findOrFail($data['assigned_to_user_id']);
        if ($assignee->hasRole('admin')) {
            throw new UnprocessableEntityHttpException('المستخدم المكلّف يجب أن يكون مستخدم عادي.');
        }

        $data['assigned_by_admin_id'] = $request->user()->id;
        $data['status'] = $data['status'] ?? AssignmentStatus::Pending->value;

        $assignment = DB::transaction(function () use ($data, $order, $request) {
            $created = Assignment::create($data);
            event(new AssignmentCreated($created, $request->user()));

            return $created;
        });

        return new AssignmentResource($assignment->load(['order', 'assignee', 'assigner']));
    }

    public function show(Assignment $assignment)
    {
        $this->authorize('view', $assignment);

        return new AssignmentResource($assignment->load(['order', 'assignee', 'assigner']));
    }

    public function update(AssignmentUpdateRequest $request, Assignment $assignment)
    {
        $order = $assignment->order;
        $orderStatus = $order->status?->value ?? $order->status;
        if (in_array($orderStatus, [OrderStatus::Canceled->value, OrderStatus::Completed->value], true)) {
            throw new UnprocessableEntityHttpException('لا يمكن تعديل تكليف طلب غير نشط.');
        }

        $data = $request->validated();
        $oldStatus = $assignment->status;

        if (array_key_exists('assigned_to_user_id', $data)) {
            $assignee = User::findOrFail($data['assigned_to_user_id']);
            if ($assignee->hasRole('admin')) {
                throw new UnprocessableEntityHttpException('المستخدم المكلّف يجب أن يكون مستخدم عادي.');
            }
        }

        $assignment = DB::transaction(function () use ($assignment, $data, $oldStatus, $request) {
            $assignment->update($data);

            if (array_key_exists('status', $data) && $oldStatus !== $assignment->status) {
                event(new AssignmentStatusUpdated($assignment, $oldStatus, $request->user()));
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
