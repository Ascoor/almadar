<?php

namespace App\Http\Controllers;

use App\Models\Litigation;
use Illuminate\Http\Request;
use App\Helpers\AdminNotifier;

class LitigationController extends Controller
{

    public function __construct()
    {
        // صلاحيات عامة لقسم 'litigations'
        $this->middleware('permission:view litigations')->only(['index', 'show']);
        $this->middleware('permission:create litigations')->only('store');
        $this->middleware('permission:edit litigations')->only('update');
        $this->middleware('permission:delete litigations')->only('destroy');
        
        // صلاحيات خاصة للقسم 'litigation-from'
        $this->middleware('permission:view litigation-from')->only(['index', 'show']);
        $this->middleware('permission:create litigation-from')->only('store');
        $this->middleware('permission:edit litigation-from')->only('update');
        $this->middleware('permission:delete litigation-from')->only('destroy');
        
        // صلاحيات خاصة للقسم 'litigation-from-actions'
        $this->middleware('permission:view litigation-from-actions')->only(['index', 'show']);
        $this->middleware('permission:create litigation-from-actions')->only('store');
        $this->middleware('permission:edit litigation-from-actions')->only('update');
        $this->middleware('permission:delete litigation-from-actions')->only('destroy');
        
        // صلاحيات خاصة للقسم 'litigation-against'
        $this->middleware('permission:view litigation-against')->only(['index', 'show']);
        $this->middleware('permission:create litigation-against')->only('store');
        $this->middleware('permission:edit litigation-against')->only('update');
        $this->middleware('permission:delete litigation-against')->only('destroy');
        
        // صلاحيات خاصة للقسم 'litigation-against-actions'
        $this->middleware('permission:view litigation-against-actions')->only(['index', 'show']);
        $this->middleware('permission:create litigation-against-actions')->only('store');
        $this->middleware('permission:edit litigation-against-actions')->only('update');
        $this->middleware('permission:delete litigation-against-actions')->only('destroy');
    
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
            '/litigations/' . $litigation->id
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
            '/litigations/' . $litigation->id
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
}
