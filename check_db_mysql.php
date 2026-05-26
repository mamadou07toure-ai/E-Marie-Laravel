<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\TypeDemande;
use App\Models\User;
use App\Models\Demande;

echo "=== DATABASE DEFAULT ===\n";
echo DB::getDefaultConnection() . "\n";

echo "\n=== TABLES ===\n";
try {
    $tables = DB::select('SHOW TABLES');
    foreach ($tables as $table) {
        $arr = (array)$table;
        echo reset($arr) . "\n";
    }
} catch (\Exception $e) {
    echo "Error listing tables: " . $e->getMessage() . "\n";
}

echo "\n=== TYPES_DEMANDES ===\n";
try {
    $types = TypeDemande::all();
    foreach ($types as $row) {
        echo $row->id . ' | ' . $row->code . ' | ' . $row->libelle . ' | active=' . ($row->is_active ? 'yes' : 'no') . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n=== USERS ===\n";
try {
    $users = User::limit(5)->get();
    foreach ($users as $row) {
        echo $row->id . ' | ' . $row->nom . ' ' . $row->prenom . ' | ' . $row->email . ' | role=' . $row->role->value . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n=== DEMANDES COUNT ===\n";
try {
    echo "Total: " . Demande::count() . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
