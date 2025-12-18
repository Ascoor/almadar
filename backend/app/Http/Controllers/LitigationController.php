<?php

namespace App\Http\Controllers;

use App\Models\Litigation;
use Illuminate\Http\Request;
use App\Events\EntityActivityRecorded;
use Spatie\Permission\Models\Permission;

class LitigationController extends Controller
{
    public function __construct()
    {
        // build your permission-to-method map
        $map = [
            'view'   => ['index', 'show'],
            'create' => ['store'],
            'edit'   => ['update'],
            'delete' => ['destroy'],
        ];

        // list all of your "modules" here
        $modules = [
            'litigations',
            'litigation-from',
            'litigation-from-actions',
            'litigation-against',
            'litigation-against-actions',
        ];

        foreach ($map as $action => $methods) {
            // build a pipe-separated list: "view litigations|view litigation-from|…"
            $perms = array_map(
                fn($mod) => "$action $mod",
                $modules
            );

            // apply ONE middleware with OR-logic for all modules
            $this
                ->middleware('permission:' . implode('|', $perms))
                ->only($methods);
        }
    }

    // ------------------------------------------------------------
    // now your routes truly have a 'show' to protect as well
    // ------------------------------------------------------------
    public function index(Request $request)
    {
        // optionally you can still gate by scope if you like:
        // $this->authorize("view litigation-{$request->scope}");

        $litigations = Litigation::with('actions.actionType')
                            ->latest()
                            ->paginate(15);

        return response()->json($litigations);
    }

    public function show(Litigation $litigation)
    {
        // again, you could do: $this->authorize("view litigation-{$litigation->scope}");
        return response()->json($litigation->load('actions.actionType'));
    }

    public function store(Request $request)
    {
        $validated = $this->validateLitigation($request);
        $validated['created_by'] = auth()->id();

        // scope‐specific gate, if you want:
        // $this->authorize("create litigation-{$validated['scope']}");

        $lit = Litigation::create($validated);

        event(new EntityActivityRecorded(
            entity: $lit,
            section: 'litigations',
            event: 'created',
            actorId: auth()->id(),
            actorName: auth()->user()?->name,
            actionUrl: "/litigations/{$lit->id}",
        ));

        return response()->json([
            'message' => 'تم إنشاء القضية بنجاح.',
            'data'    => $lit,
        ], 201);
    }

    public function update(Request $request, Litigation $litigation)
    {
        $validated = $this->validateLitigation($request);
        $validated['updated_by'] = auth()->id();

        // $this->authorize("edit litigation-{$litigation->scope}");

        $litigation->update($validated);

        event(new EntityActivityRecorded(
            entity: $litigation,
            section: 'litigations',
            event: 'updated',
            actorId: auth()->id(),
            actorName: auth()->user()?->name,
            actionUrl: "/litigations/{$litigation->id}",
        ));

        return response()->json([
            'message' => 'تم تحديث القضية بنجاح.',
            'data'    => $litigation,
        ]);
    }

    public function destroy(Litigation $litigation)
    {
        // $this->authorize("delete litigation-{$litigation->scope}");

        try {
            $litigation->actions()->delete();
            $litigation->delete();

            return response()->json([
                'message' => 'تم حذف الدعوى وجميع الإجراءات التابعة لها بنجاح.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء الحذف.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    private function validateLitigation(Request $request)
    {
        return $request->validate([
            'scope'        => 'required|in:from,against',
            'case_number'  => 'required|string|unique:litigations,case_number,' . ($request->id ?? 'null'),
            'case_year'    => 'required|string',
            'opponent'     => 'required|string|max:255',
            'court'        => 'required|string|max:255',
            'filing_date'  => 'required|date',
            'subject'      => 'required|string|max:255',
            'status'       => 'required|in:open,in_progress,closed',
            'notes'        => 'nullable|string|max:1000',
        ]);
    }
}
