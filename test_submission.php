<?php

use App\Models\User;
use App\Models\TypeDemande;
use App\Http\Requests\Demande\StoreDemandeRequest;
use App\Http\Controllers\Api\V1\DemandeController;
use Illuminate\Support\Facades\Auth;

// Bootstrap Laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Log in as Citoyen 1
$user = User::where('email', 'citoyen1@gmail.com')->first();
if (!$user) {
    echo "Citizen user not found!\n";
    exit(1);
}
Auth::login($user);
echo "Logged in as {$user->email} (ID: {$user->id})\n";

// Let's create a mockup request for ACTE_NAISSANCE
$requestData = [
    'type_demande_id' => 'ACTE_NAISSANCE',
    'priorite' => 'normale',
    'description' => 'Demande de test automatique.',
    'fields' => [
        'nom' => 'Touré',
        'prenoms' => 'Ibrahima',
        'date_naissance' => '1990-05-15',
        'lieu_naissance' => 'Conakry',
        'genre' => 'M',
        'nom_pere' => 'Touré',
        'prenom_pere' => 'Mamadou',
        'date_naissance_pere' => '1960-01-01',
        'profession_pere' => 'Enseignant',
        'nom_mere' => 'Diallo',
        'prenom_mere' => 'Mariama',
        'date_naissance_mere' => '1965-02-02',
        'profession_mere' => 'Ménagère',
        'motif' => 'administratif',
        'nombre_copies' => 2,
        'observations' => 'Test observation.'
    ],
    'documents' => []
];

// Execute the request
try {
    $request = StoreDemandeRequest::create('/citoyen/demandes', 'POST', $requestData);
    $request->setUserResolver(function () use ($user) {
        return $user;
    });

    // Manually validate using the FormRequest
    $validator = app('validator')->make($requestData, $request->rules());
    if ($validator->fails()) {
        echo "Validation failed!\n";
        print_r($validator->errors()->all());
        exit(1);
    }
    echo "Validation passed successfully!\n";

    // Call store method
    $controller = new DemandeController();
    $response = $controller->store($request);
    
    echo "Store method executed successfully! Response status: " . $response->getStatusCode() . "\n";
    if (method_exists($response, 'getTargetUrl')) {
        echo "Redirecting to: " . $response->getTargetUrl() . "\n";
    }
} catch (\Exception $e) {
    echo "Exception caught: " . get_class($e) . "\n";
    echo "Message: " . $e->getMessage() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}
