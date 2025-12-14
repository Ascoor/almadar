<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AssignmentService;
use Illuminate\Http\Request;

class AssignableUserController extends Controller
{
    public function index(Request $request)
    {
        $context = $request->get('context');
        $query = trim((string) $request->get('q'));

        abort_if(!array_key_exists($context, AssignmentService::CONTEXT_ROLES), 422, 'Invalid context');

        $roles = AssignmentService::CONTEXT_ROLES[$context];

        $users = User::query()
            ->whereHas('roles', function ($roleQuery) use ($roles) {
                $roleQuery->whereIn('name', $roles);
            })
            ->when($query, function ($userQuery) use ($query) {
                $userQuery->where(function ($inner) use ($query) {
                    $inner->where('name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%");
                });
            })
            ->select(['id', 'name', 'email'])
            ->with('roles:id,name')
            ->orderBy('name')
            ->get()
            ->map(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames(),
                ];
            });

        return response()->json($users);
    }
}
