<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'uuid' => (string) Str::uuid(),
            'nom' => 'Administrateur',
            'prenom' => 'System',
            'email' => 'admin@mairie.gn',
            'telephone' => '620000000',
            'password' => Hash::make('password'),
            'role' => RoleEnum::ADMINISTRATEUR,
            'is_active' => true,
        ]);

        // Agents
        for ($i = 1; $i <= 3; $i++) {
            User::create([
                'uuid' => (string) Str::uuid(),
                'nom' => "Agent$i",
                'prenom' => 'Mairie',
                'email' => "agent$i@mairie.gn",
                'telephone' => "62100000$i",
                'password' => Hash::make('password'),
                'role' => RoleEnum::AGENT,
                'is_active' => true,
            ]);
        }

        // Citoyens
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'uuid' => (string) Str::uuid(),
                'nom' => "Citoyen$i",
                'prenom' => 'Guinéen',
                'email' => "citoyen$i@gmail.com",
                'telephone' => "6220000$i",
                'password' => Hash::make('password'),
                'role' => RoleEnum::CITOYEN,
                'is_active' => true,
            ]);
        }
    }
}
