<?php

namespace App\Http\Controllers;

use App\Models\InvestigationAction;
use Illuminate\Http\Request;

class InvestigationActionController extends Controller
{
    public function index()
    {
        return InvestigationAction::with('investigation')->get();
    }

    public function store(Request $request)
    {
        $action = InvestigationAction::create($request->all());
        return response()->json($action, 201);
    }

    public function show(InvestigationAction $investigationAction)
    {
        return $investigationAction->load('investigation');
    }

    public function update(Request $request, InvestigationAction $investigationAction)
    {
        $investigationAction->update($request->all());
        return response()->json($investigationAction, 200);
    }

    public function destroy(InvestigationAction $investigationAction)
    {
        $investigationAction->delete();
        return response()->json(null, 204);
    }
}
