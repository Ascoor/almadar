<?php
namespace App\Http\Controllers;

use App\Models\InvestigationActionType;
use Illuminate\Http\Request;

class InvestigationActionTypeController extends Controller
{
    public function index()
    {
      
  return response()->json(
        InvestigationActionType::orderBy('created_at', 'desc')->get()
 
  );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'action_name' => 'required|string|max:255',
        ]);

        $actionType = InvestigationActionType::create($validated);

        return response()->json($actionType, 201);
    }

    public function show(InvestigationActionType $investigationActionType)
    {
        return response()->json($investigationActionType);
    }

    public function update(Request $request, InvestigationActionType $investigationActionType)
    {
        $validated = $request->validate([
            'action_name' => 'sometimes|required|string|max:255',
        ]);

        $investigationActionType->update($validated);

        return response()->json($investigationActionType);
    }

    public function destroy(InvestigationActionType $investigationActionType)
    {
        $investigationActionType->delete();

        return response()->json(['message' => 'Deleted successfully.']);
    }
}
