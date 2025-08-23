<?php

namespace App\Http\Controllers;

use App\Models\Contract; 
use App\Models\Litigation;
use App\Models\Investigation;
use App\Models\InvestigationAction;
use App\Models\LegalAdvice;
use App\Models\LitigationAction;
use Illuminate\Http\JsonResponse;
 
class DashboardController extends Controller
{
   
public function statistics(): JsonResponse
{
   
           $contracts = Contract::all();
           $litigations = Litigation::all();
           $investigations = Investigation::all();
           $legal_advices = LegalAdvice::all();
     return response()->json([
  'contracts' => $contracts,
  'litigations' => $litigations,
  'investigations' => $investigations,
  'legal_advices' => $legal_advices,
]);


 }
public function getAllRecentData()
{
    // جلب آخر 5 عقود تم إضافتها مع الفئات
    $latestAddedContracts = Contract::with('category') // ربط عقد بالفئة (category)
        ->latest('created_at')
        ->take(5)
        ->get();

    $latestUpdatedContracts = Contract::with('category') // ربط عقد بالفئة (category)
        ->latest('updated_at')
        ->take(5)
        ->get();

    // جلب آخر 5 إجراءات في التحقيقات مع نوع الإجراء
    $latestInvestigationActions = InvestigationAction::with('actionType') // ربط إجراء التحقيق بنوع الإجراء
        ->latest('updated_at')
        ->take(5)
        ->get();

    // جلب آخر 5 إجراءات في القضايا مع نوع الإجراء
    $latestLitigationActions = LitigationAction::with('actionType') // ربط إجراء القضايا بنوع الإجراء
        ->latest('updated_at')
        ->take(5)
        ->get();

    // ترتيب البيانات في هيكل واحد وإرجاعها كـ JSON
    return response()->json([
        'latestAddedContracts' => $latestAddedContracts,
        'latestUpdatedContracts' => $latestUpdatedContracts,
        'latestInvestigationActions' => $latestInvestigationActions,
        'latestLitigationActions' => $latestLitigationActions,
    ]);
}

  }