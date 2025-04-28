<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    // index
    public function index()
    {
        $contracts = Contract::with('category')->latest()->paginate(15);
        return response()->json($contracts);
    }

    // store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_category_id' => 'required|exists:contract_categories,id',
            'scope' => 'required|in:local,international',
            'number' => 'required|string|unique:contracts,number',
            'value' => 'nullable|numeric',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
            'status' => 'required|in:active,expired,terminated,pending,cancelled',
            'summary' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('attachments/contracts', 'public');
        }

        $contract = Contract::create($validated);

        return response()->json([
            'message' => 'تم إنشاء العقد بنجاح.',
            'contract' => $contract,
        ], 201);
    }

    // show
    public function show(Contract $contract)
    {
        $contract->load('category');
        return response()->json($contract);
    }

    // update
    public function update(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'contract_category_id' => 'required|exists:contract_categories,id',
            'scope' => 'required|in:local,international',
            'number' => 'required|string|unique:contracts,number,' . $contract->id,
            'value' => 'nullable|numeric',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
            'status' => 'required|in:active,expired,terminated,pending,cancelled',
            'summary' => 'nullable|string',
            'attachment' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($request->hasFile('attachment')) {
            if ($contract->attachment) {
                Storage::disk('public')->delete($contract->attachment);
            }
            $validated['attachment'] = $request->file('attachment')->store('attachments/contracts', 'public');
        }

        $contract->update($validated);

        return response()->json([
            'message' => 'تم تحديث العقد بنجاح.',
            'contract' => $contract,
        ]);
    }

    // destroy
    public function destroy(Contract $contract)
    {
        if ($contract->attachment) {
            Storage::disk('public')->delete($contract->attachment);
        }

        $contract->delete();

        return response()->json([
            'message' => 'تم حذف العقد بنجاح.',
        ]);
    }
}
