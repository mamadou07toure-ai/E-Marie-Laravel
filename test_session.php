<?php
require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client(['cookies' => true, 'http_errors' => false]);
$baseUrl = 'http://127.0.0.1:8000';

echo "1. GET /connexion\n";
$res = $client->get($baseUrl . '/connexion', ['headers' => ['Accept' => 'text/html']]);
echo "Status: " . $res->getStatusCode() . "\n";
// Get XSRF token
$cookies = $client->getConfig('cookies')->toArray();
$xsrf = '';
foreach ($cookies as $cookie) {
    if ($cookie['Name'] === 'XSRF-TOKEN') {
        $xsrf = urldecode($cookie['Value']);
    }
}

echo "2. POST /connexion\n";
$res = $client->post($baseUrl . '/connexion', [
    'headers' => [
        'X-XSRF-TOKEN' => $xsrf,
        'Accept' => 'application/json',
        'Referer' => $baseUrl . '/connexion'
    ],
    'form_params' => [
        'email' => 'agent1@mairie.gn',
        'password' => 'password',
    ]
]);
echo "Status: " . $res->getStatusCode() . "\n";
echo "Body: " . $res->getBody() . "\n";

echo "3. GET /agent/tableau-de-bord (Inertia)\n";
$res = $client->get($baseUrl . '/agent/tableau-de-bord', [
    'headers' => [
        'X-Inertia' => 'true',
        'X-Inertia-Version' => '',
        'Accept' => 'text/html, application/xhtml+xml',
        'Referer' => $baseUrl . '/connexion'
    ]
]);
echo "Status: " . $res->getStatusCode() . "\n";
$inertiaVersion = $res->getHeaderLine('X-Inertia-Version');

echo "4. GET /api/v1/messages/conversations (Background poll)\n";
$res = $client->get($baseUrl . '/api/v1/messages/conversations', [
    'headers' => [
        'Accept' => 'application/json',
        'X-Requested-With' => 'XMLHttpRequest',
        'Referer' => $baseUrl . '/agent/tableau-de-bord'
    ]
]);
echo "Status: " . $res->getStatusCode() . "\n";
echo "Body: " . $res->getBody() . "\n";

echo "5. GET /agent/demandes (Click on link)\n";
$res = $client->get($baseUrl . '/agent/demandes', [
    'headers' => [
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $inertiaVersion,
        'Accept' => 'text/html, application/xhtml+xml',
        'Referer' => $baseUrl . '/agent/tableau-de-bord'
    ]
]);
echo "Status: " . $res->getStatusCode() . "\n";
echo "Location: " . $res->getHeaderLine('Location') . "\n";
if ($res->getStatusCode() == 302 || $res->getStatusCode() == 401 || $res->getStatusCode() == 409) {
    echo "FAILED! Got redirected or unauthorized.\n";
} else {
    echo "SUCCESS!\n";
}

