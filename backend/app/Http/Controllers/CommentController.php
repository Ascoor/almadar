<?php

namespace App\Http\Controllers;

use App\Services\CommentService;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(private CommentService $service)
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request, string $module, int $id)
    {
        $comments = $this->service->getComments($module, $id);

        return response()->json(['data' => $comments]);
    }

    public function store(Request $request, string $module, int $id)
    {
        $data = $request->validate([
            'body' => 'required|string',
        ]);

        $comment = $this->service->addComment($module, $id, $data['body'], $request->user());

        return response()->json([
            'message' => 'تم إضافة التعليق بنجاح.',
            'comment' => $comment,
        ], 201);
    }
}
