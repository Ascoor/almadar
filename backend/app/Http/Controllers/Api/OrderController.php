<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Events\OrderCreated;
use App\Events\OrderStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\OrderStoreRequest;
use App\Http\Requests\OrderUpdateRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Order::class);

        $query = Order::with(['service', 'user', 'assignment.assignee']);

        if (!$request->user()->hasRole('admin')) {
            $query->where('user_id', $request->user()->id);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($request->user()->hasRole('admin') && $request->filled('user_id')) {
            $query->where('user_id', $request->query('user_id'));
        }

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->query('service_id'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->query('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->query('date_to'));
        }

        $query->orderBy(...$this->sortParams($request, 'created_at'));

        $orders = $query->paginate($request->integer('per_page', 15))->withQueryString();

        return OrderResource::collection($orders);
    }

    public function store(OrderStoreRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();

        if (!$user->hasRole('admin') || empty($data['user_id'])) {
            $data['user_id'] = $user->id;
        }

        $data['status'] = $data['status'] ?? OrderStatus::Pending->value;
        $data['order_number'] = $this->generateOrderNumber();

        $order = DB::transaction(function () use ($data, $user) {
            $created = Order::create($data);
            event(new OrderCreated($created, $user));

            return $created;
        });

        return new OrderResource($order->load(['service', 'user']));
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        return new OrderResource($order->load(['service', 'user', 'assignment.assignee', 'assignment.assigner']));
    }

    public function update(OrderUpdateRequest $request, Order $order)
    {
        $data = $request->validated();
        $oldStatus = $order->status;

        if (array_key_exists('status', $data)) {
            $this->assertStatusTransition($order, $data['status']);
        }

        $order = DB::transaction(function () use ($order, $data, $oldStatus, $request) {
            $order->update($data);

            if (array_key_exists('status', $data) && $oldStatus !== $order->status) {
                event(new OrderStatusUpdated($order, $oldStatus, $request->user()));
            }

            return $order;
        });

        return new OrderResource($order->load(['service', 'user', 'assignment.assignee', 'assignment.assigner']));
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);
        $order->delete();

        return response()->noContent();
    }

    private function assertStatusTransition(Order $order, string $newStatus): void
    {
        if ($newStatus === OrderStatus::Completed->value && !in_array($order->status?->value ?? $order->status, [OrderStatus::Paid->value, OrderStatus::InProgress->value], true)) {
            throw new UnprocessableEntityHttpException('لا يمكن إتمام الطلب قبل دفعه أو بدء العمل عليه.');
        }

        if ($newStatus === OrderStatus::Canceled->value && $order->status === OrderStatus::Completed) {
            throw new UnprocessableEntityHttpException('لا يمكن إلغاء طلب مكتمل.');
        }
    }

    private function sortParams(Request $request, string $defaultColumn): array
    {
        $sort = $request->query('sort', $defaultColumn);
        $direction = Str::startsWith($sort, '-') ? 'desc' : 'asc';
        $column = ltrim($sort, '-');

        return [$column, $direction];
    }

    private function generateOrderNumber(): string
    {
        do {
            $number = 'ORD-' . Str::upper(Str::random(8));
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}
