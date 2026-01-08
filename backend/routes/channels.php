<?php

use App\Models\Contract;
use App\Models\Investigation;
use App\Models\LegalAdvice;
use App\Models\Litigation;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('admins.{id}', function ($user, $id) {
    return $user->hasRole('Admin') && (int) $user->id === (int) $id;
});

$modules = [
    'legal-advices' => [
        'model' => LegalAdvice::class,
        'permissions' => ['legal-advices'],
    ],
    'contracts' => [
        'model' => Contract::class,
        'permissions' => ['contracts'],
    ],
    'investigations' => [
        'model' => Investigation::class,
        'permissions' => ['investigations'],
    ],
    'litigations' => [
        'model' => Litigation::class,
        'permissions' => ['litigations'],
    ],
];

Broadcast::channel('entity.{module}.{id}', function ($user, string $module, int $id) use ($modules) {
    $meta = Arr::get($modules, $module);

    if (!$meta) {
        return false;
    }

    $permissions = Arr::get($meta, 'permissions', []);
    $canView = collect($permissions)->contains(
        fn (string $permission) => $user?->can("view {$permission}") === true
    );

    if (!$canView) {
        return false;
    }

    $model = Arr::get($meta, 'model');
    if (!$model) {
        return false;
    }

    return $model::query()->whereKey($id)->exists();
});
