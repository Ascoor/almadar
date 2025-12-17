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

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Order::class);
        $query = Order::with(['user', 'service', 'assignment']);
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }
        if ($request->filled('service_id')) {
            $query->where('service_id', $request->input('service_id'));
        }
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->input('from_date'));
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->input('to_date'));
        }
        if ($request->filled('sort')) {
            $direction = str_starts_with($request->string('sort'), '-') ? 'desc' : 'asc';
            $column = ltrim($request->string('sort'), '-');
            $query->orderBy($column, $direction);
        }
        $orders = $query->paginate();
        return OrderResource::collection($orders);
    }

    public function store(OrderStoreRequest $request)
    {
        $this->authorize('create', Order::class);
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $validated['order_number'] = Str::upper(Str::random(10));
        $validated['status'] = $validated['status'] ?? OrderStatus::Pending;
        $order = DB::transaction(function () use ($validated) {
            $order = Order::create($validated);
            event(new OrderCreated($order));
            return $order->load(['user', 'service']);
        });
        return new OrderResource($order);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        $order->load(['user', 'service', 'assignment']);
        return new OrderResource($order);
    }

    public function update(OrderUpdateRequest $request, Order $order)
    {
        $this->authorize('update', $order);
        $data = $request->validated();
        $order = DB::transaction(function () use ($order, $data) {
            $order->update($data);
            if (array_key_exists('status', $data)) {
                event(new OrderStatusUpdated($order));
            }
            return $order->load(['user', 'service', 'assignment']);
        });
        return new OrderResource($order);
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);
        $order->delete();
        return response()->noContent();
    }
}
