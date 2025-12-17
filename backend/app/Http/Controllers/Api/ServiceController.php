<?php

namespace App\Http\Controllers\Api;

use App\Enums\ServiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceStoreRequest;
use App\Http\Requests\ServiceUpdateRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Service::class);

        $query = Service::query();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->query('price_min'));
        }

        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->query('price_max'));
        }

        $query->orderBy(...$this->sortParams($request, 'created_at'));

        $services = $query->paginate($request->integer('per_page', 15))->withQueryString();

        return ServiceResource::collection($services);
    }

    public function store(ServiceStoreRequest $request)
    {
        $data = $request->validated();
        $data['status'] = $data['status'] ?? ServiceStatus::Draft->value;

        $service = DB::transaction(fn () => Service::create($data));

        return new ServiceResource($service);
    }

    public function show(Service $service)
    {
        $this->authorize('view', $service);

        return new ServiceResource($service);
    }

    public function update(ServiceUpdateRequest $request, Service $service)
    {
        $data = $request->validated();
        $service = DB::transaction(function () use ($service, $data) {
            $service->update($data);

            return $service;
        });

        return new ServiceResource($service);
    }

    public function destroy(Service $service)
    {
        $this->authorize('delete', $service);
        $service->delete();

        return response()->noContent();
    }

    private function sortParams(Request $request, string $defaultColumn): array
    {
        $sort = $request->query('sort', $defaultColumn);
        $direction = Str::startsWith($sort, '-') ? 'desc' : 'asc';
        $column = ltrim($sort, '-');

        return [$column, $direction];
    }
}
