<?php
try {
    $d = App\Models\Demande::with(['user', 'typeDemande', 'agent'])->latest()->paginate(20);
    echo "OK: " . $d->count();
} catch (\Exception $e) {
    echo "ERR: " . $e->getMessage();
}
