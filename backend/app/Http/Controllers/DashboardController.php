<?php

namespace App\Http\Controllers;

use App\Models\Contract; 
use App\Models\Litigation;
use App\Models\Investigation;
use App\Models\LegalAdvice;
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
}