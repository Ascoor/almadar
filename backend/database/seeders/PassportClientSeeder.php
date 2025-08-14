<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Laravel\Passport\Client;
use Laravel\Passport\ClientRepository;

class PassportClientSeeder extends Seeder
{
    public function run(): void
    {
        $repo = app(ClientRepository::class);
        $client = Client::where('password_client', true)->first();

        if (! $client) {
            $client = $repo->createPasswordGrantClient(null, 'SPA Password Client', 'http://localhost');
        }

        $this->command->info('Password Client ID: '.$client->id);
        $this->command->info('Password Client Secret: '.$client->secret);
    }
}
