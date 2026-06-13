<?php
$user = App\Models\User::where('email', 'agent1@mairie.gn')->first();
$req = Illuminate\Http\Request::create('/api/v1/agent/demandes', 'GET');
$req->headers->set('Accept', 'application/json');
$req->setUserResolver(function() use ($user) { return $user; });
$res = app()->handle($req);
echo "STATUS: " . $res->getStatusCode() . "\n";
echo "CONTENT: " . substr($res->getContent(), 0, 500) . "\n";
