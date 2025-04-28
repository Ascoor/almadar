<?php

namespace App\Http\Controllers;

use App\Models\LegalAdvice;
use Illuminate\Http\Request;

class LegalAdviceController extends Controller
{
    public function index()
    {
        return LegalAdvice::all();
    }

    public function store(Request $request)
    {
        $advice = LegalAdvice::create($request->all());
        return response()->json($advice, 201);
    }

    public function show(LegalAdvice $legalAdvice)
    {
        return $legalAdvice;
    }

    public function update(Request $request, LegalAdvice $legalAdvice)
    {
        $legalAdvice->update($request->all());
        return response()->json($legalAdvice, 200);
    }

    public function destroy(LegalAdvice $legalAdvice)
    {
        $legalAdvice->delete();
        return response()->json(null, 204);
    }
}
