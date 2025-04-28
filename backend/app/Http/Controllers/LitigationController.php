<?php

namespace App\Http\Controllers;

use App\Models\Litigation;
use Illuminate\Http\Request;

class LitigationController extends Controller
{
    public function index()
    {
        return Litigation::all();
    }

    public function store(Request $request)
    {
        $litigation = Litigation::create($request->all());
        return response()->json($litigation, 201);
    }

    public function show(Litigation $litigation)
    {
        return $litigation;
    }

    public function update(Request $request, Litigation $litigation)
    {
        $litigation->update($request->all());
        return response()->json($litigation, 200);
    }

    public function destroy(Litigation $litigation)
    {
        $litigation->delete();
        return response()->json(null, 204);
    }
}
