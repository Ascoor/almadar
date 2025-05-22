<?php
namespace App\Http\Controllers;

use App\Models\LitigationActionType;
use Illuminate\Http\Request;

class LitigationActionTypeController extends Controller
{
    public function index()
    {
  return response()->json(
        LitigationActionType::orderBy('created_at', 'desc')->get()
    );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'action_name' => 'required|string|max:255',
        ]);

        $actionType = LitigationActionType::create($validated);

        return response()->json($actionType, 201);
    }

    public function show(LitigationActionType $litigationActionType)
    {
        return response()->json($litigationActionType);
    }

    public function update(Request $request, LitigationActionType $litigationActionType)
    {
        $validated = $request->validate([
            'action_name' => 'sometimes|required|string|max:255',
        ]);

        $litigationActionType->update($validated);

        return response()->json($litigationActionType);
    }

    public function destroy(LitigationActionType $litigationActionType)
    {
        $litigationActionType->delete();

        return response()->json(['message' => 'Deleted successfully.']);
    }
}
