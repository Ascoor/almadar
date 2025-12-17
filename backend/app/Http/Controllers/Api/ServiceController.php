<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceStoreRequest;
use App\Http\Requests\ServiceUpdateRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Service::class);
        $query = Service::query();
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->input('price_min'));
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->input('price_max'));
        }
        if ($request->filled('sort')) {
            $direction = str_starts_with($request->string('sort'), '-') ? 'desc' : 'asc';
            $column = ltrim($request->string('sort'), '-');
            $query->orderBy($column, $direction);
        }
        $services = $query->paginate();
        return ServiceResource::collection($services);
    }

    public function store(ServiceStoreRequest $request)
    {
        $this->authorize('create', Service::class);
        $service = Service::create($request->validated());
        return new ServiceResource($service);
    }

    public function show(Service $service)
    {
        $this->authorize('view', $service);
        return new ServiceResource($service);
    }

    public function update(ServiceUpdateRequest $request, Service $service)
    {
        $this->authorize('update', $service);
        $service->update($request->validated());
        return new ServiceResource($service);
    }

    public function destroy(Service $service)
    {
        $this->authorize('delete', $service);
        $service->delete();
        return response()->noContent();
    }
}
