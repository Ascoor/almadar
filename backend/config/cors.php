<?php
return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */ 
    'paths' => [
    'api/*',
    'storage/',
    'broadcasting/auth',
    'sanctum/csrf-cookie',
    '*',
],
'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:7000',
    'http://127.0.0.1:7000',
    'https://madar-app.ask-ar.net',
],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
'supports_credentials' => true,
];