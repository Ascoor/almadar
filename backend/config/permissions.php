<?php

return [
    'roles' => [
        'employee',
        'lawyer',
        'dept_head',
        'admin',
    ],

    'permissions' => [
        'contracts' => [
            'contracts.create',
            'contracts.review',
            'contracts.assign',
            'contracts.manage',
        ],
        'investigations' => [
            'investigations.create',
            'investigations.review',
            'investigations.assign',
            'investigations.manage',
        ],
        'litigations' => [
            'litigations.create',
            'litigations.review',
            'litigations.approve',
            'litigations.assign',
            'litigations.manage',
        ],
        'legal_advices' => [
            'legal_advices.create',
            'legal_advices.review',
            'legal_advices.manage',
        ],
        'departments' => [
            'departments.manage',
        ],
        'roles' => [
            'roles.manage',
        ],
        'staff' => [
            'staff.manage',
        ],
        'audits' => [
            'audits.view',
        ],
    ],

    'role_permission_map' => [
        'employee' => [
            'contracts.review',
            'investigations.review',
            'litigations.review',
            'legal_advices.review',
        ],
        'lawyer' => [
            'contracts.review',
            'litigations.review',
            'litigations.approve',
            'legal_advices.review',
        ],
        'dept_head' => [
            'contracts.review',
            'contracts.assign',
            'investigations.assign',
            'investigations.manage',
            'litigations.assign',
            'legal_advices.manage',
            'departments.manage',
            'staff.manage',
        ],
        'admin' => [
            'contracts.create',
            'contracts.review',
            'contracts.assign',
            'contracts.manage',
            'investigations.create',
            'investigations.review',
            'investigations.assign',
            'investigations.manage',
            'litigations.create',
            'litigations.review',
            'litigations.approve',
            'litigations.assign',
            'litigations.manage',
            'legal_advices.create',
            'legal_advices.review',
            'legal_advices.manage',
            'departments.manage',
            'roles.manage',
            'staff.manage',
            'audits.view',
        ],
    ],
];
