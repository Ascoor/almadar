<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CityResource;
use App\Http\Resources\AreaResource;
use App\Http\Resources\DistrictResource;
use App\Models\City;
use App\Models\District;
use App\Models\Area;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function cities(Request $request)
    {
        $cities = City::with(['districts.areas'])->orderBy('name')->get();

        return CityResource::collection($cities);
    }

    public function districts(City $city)
    {
        return CityResource::make($city->load('districts.areas'));
    }

    public function areas(District $district)
    {
        return new DistrictResource($district->load('areas'));
    }

    public function area(Area $area)
    {
        return new AreaResource($area);
    }
}
