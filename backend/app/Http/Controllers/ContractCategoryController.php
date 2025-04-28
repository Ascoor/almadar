<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ContractCategory;
use Illuminate\Http\Request;

class ContractCategoryController extends Controller
{
    // index
    public function index()
    {
        $categories = ContractCategory::latest()->paginate(20);
        return response()->json($categories);
    }

    // store
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:contract_categories,name',
        ]);

        $category = ContractCategory::create($validated);

        return response()->json([
            'message' => 'تم إنشاء التصنيف بنجاح.',
            'category' => $category,
        ], 201);
    }

    // show
    public function show(ContractCategory $contractCategory)
    {
        return response()->json($contractCategory);
    }

    // update
    public function update(Request $request, ContractCategory $contractCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:contract_categories,name,' . $contractCategory->id,
        ]);

        $contractCategory->update($validated);

        return response()->json([
            'message' => 'تم تحديث التصنيف بنجاح.',
            'category' => $contractCategory,
        ]);
    }

    // destroy
    public function destroy(ContractCategory $contractCategory)
    {
        $contractCategory->delete();

        return response()->json([
            'message' => 'تم حذف التصنيف بنجاح.',
        ]);
    }
}
