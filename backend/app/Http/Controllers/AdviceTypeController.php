<?php

namespace App\Http\Controllers;

use App\Models\AdviceType;
use Illuminate\Http\Request;

class AdviceTypeController extends Controller
{
    /**
     * Display a listing of the legal advice types.
     */
    public function index()
    {
        $types = AdviceType::all();
        return response()->json($types);
    }

    /**
     * Store a newly created legal advice type in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'type_name' => 'required|string|max:255',
        ]);

        // Create a new legal advice type
        $type = AdviceType::create($validated);

        return response()->json([
            'message' => 'Legal advice type created successfully.',
            'data' => $type,
        ], 201);
    }

    /**
     * Display the specified legal advice type.
     */
    public function show(AdviceType $AdviceType)
    {
        return response()->json($AdviceType);
    }

    /**
     * Update the specified legal advice type in storage.
     */
    public function update(Request $request, AdviceType $AdviceType)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'type_name' => 'sometimes|required|string|max:255',
        ]);

        // Update the legal advice type
        $AdviceType->update($validated);

        return response()->json([
            'message' => 'Legal advice type updated successfully.',
            'data' => $AdviceType,
        ]);
    }

    /**
     * Remove the specified legal advice type from storage.
     */
    public function destroy(AdviceType $AdviceType)
    {
        $AdviceType->delete();

        return response()->json([
            'message' => 'Legal advice type deleted successfully.',
        ]);
    }
}
