<?php

namespace App\Http\Controllers;

use App\Models\Litigation;
use Illuminate\Http\Request;
use App\Helpers\AdminNotifier;

class LitigationController extends Controller
{
    public function __construct()
{
    foreach ($this->getModulePermissions() as $module => $actions) {
        foreach ($actions as $action) {
            $methods = $this->getPermissionMethodMap()[$action] ?? [];
            if (!empty($methods)) {
                $this->middleware("permission:{$action} {$module}")->only($methods);
            }
        }
    }
}

/**
 * Permissions assigned to each module.
 *
 * @return array<string, string[]>
 */
protected function getModulePermissions(): array
{
    return [
        'litigations' => ['view', 'create', 'edit', 'delete'],
        'litigation-from' => ['view', 'create', 'edit', 'delete'],
        'litigation-from-actions' => ['view', 'create', 'edit', 'delete'],
        'litigation-against' => ['view', 'create', 'edit', 'delete'],
        'litigation-against-actions' => ['view', 'create', 'edit', 'delete'],
    ];
}
    public function index()
    {
        $litigations = Litigation::with('actions.actionType')->latest()->paginate(15);
        return response()->json($litigations);
    }

    public function store(Request $request)
    {
        $validated = $this->validateLitigation($request);
        $validated['created_by'] = auth()->id();

        $litigation = Litigation::create($validated);

        AdminNotifier::notifyAll(
            '📄 قضية جديدة',
            'تمت إضافة قضية برقم: ' . $litigation->case_number,
            '/litigations/' . $litigation->id,
     auth()->id()
        );

        return response()->json([
            'message' => 'تم إنشاء القضية بنجاح.',
            'data'    => $litigation,
        ], 201);
    }

    public function update(Request $request, Litigation $litigation)
    {
        $validated = $this->validateLitigation($request);
        $validated['updated_by'] = auth()->id();

        $litigation->update($validated);

        AdminNotifier::notifyAll(
            '✏️ تعديل قضية',
            'تم تعديل القضية رقم: ' . $litigation->case_number,
            '/litigations/' . $litigation->id,
     auth()->id()
        );

        return response()->json([
            'message' => 'تم تحديث القضية بنجاح.',
            'data'    => $litigation,
        ]);
    }

    public function destroy(Litigation $litigation)
    {
        try {
            $litigation->actions()->delete();
            $litigation->delete();

            return response()->json([
                'message' => 'تم حذف الدعوى القضائية وجميع الإجراءات التابعة لها بنجاح.'
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
    
/**
 * Maps permission actions to controller methods.
 *
 * @return array<string, string[]>
 */
protected function getPermissionMethodMap(): array
{
    return [
        'view' => ['index', 'show'],
        'create' => ['store'],
        'edit' => ['update'],
        'delete' => ['destroy'],
    ];
}
}
