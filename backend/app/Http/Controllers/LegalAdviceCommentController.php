<?php

namespace App\Http\Controllers;

use App\Models\LegalAdvice;
use App\Models\LegalAdviceComment;
use Illuminate\Http\Request;

class LegalAdviceCommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view legaladvices')->only('index');
        $this->middleware('permission:create legaladvices')->only('store');
    }

    public function index(LegalAdvice $legalAdvice)
    {
        $comments = $legalAdvice->comments()
            ->with('user:id,name')
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function store(Request $request, LegalAdvice $legalAdvice)
    {
        $data = $request->validate([
            'comment' => 'required|string',
        ]);

        $comment = new LegalAdviceComment([
            'comment' => $data['comment'],
        ]);
        $comment->user()->associate($request->user());
        $comment->legalAdvice()->associate($legalAdvice);
        $comment->save();

        $comment->load('user:id,name');

        return response()->json([
            'message' => 'تم إضافة التعليق بنجاح.',
            'comment' => $comment,
        ], 201);
    }
}
