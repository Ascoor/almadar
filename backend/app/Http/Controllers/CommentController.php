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

    public function markAsRead(Request $request)
    {
        $data = $request->validate([
            'comment_ids' => 'array',
            'comment_ids.*' => 'integer',
            'entity_type' => 'nullable|string',
            'entity_id' => 'nullable|integer',
        ]);

        abort_if(
            empty($data['comment_ids']) && (empty($data['entity_type']) || empty($data['entity_id'])),
            422,
            'يجب تحديد التعليقات أو الكيان المستهدف.',
        );

        $this->service->markAsRead(
            $data['entity_type'] ?? null,
            $data['entity_id'] ?? null,
            $data['comment_ids'] ?? [],
            $request->user(),
        );

        return response()->json(['message' => 'تم تحديث حالة التعليقات.']);
    }
}
