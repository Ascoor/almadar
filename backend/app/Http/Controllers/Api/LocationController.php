<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AreaResource;
use App\Http\Resources\CityResource;
use App\Models\Area;
use App\Models\City;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function cities(Request $request)
    {
        $cities = City::with('areas')->paginate();
        return CityResource::collection($cities);
    }

    public function areas(City $city)
    {
        $areas = $city->areas()->paginate();
        return AreaResource::collection($areas);
    }

    public function allAreas()
    {
        $areas = Area::with('city')->paginate();
        return AreaResource::collection($areas);
    }
}
