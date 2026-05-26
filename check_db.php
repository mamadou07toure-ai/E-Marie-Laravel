<?php
$db = new PDO('sqlite:database/database.sqlite');

echo "=== TABLES ===\n";
$tables = $db->query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
foreach ($tables as $row) {
    echo $row['name'] . "\n";
}

echo "\n=== TYPES_DEMANDES ===\n";
try {
    $types = $db->query("SELECT * FROM types_demandes");
    foreach ($types as $row) {
        echo $row['id'] . ' | ' . $row['code'] . ' | ' . $row['libelle'] . ' | active=' . $row['is_active'] . "\n";
    }
} catch (Exception $e) {
    echo "Table not found or error: " . $e->getMessage() . "\n";
}

echo "\n=== USERS ===\n";
try {
    $users = $db->query("SELECT id, nom, prenom, email, role FROM users LIMIT 5");
    foreach ($users as $row) {
        echo $row['id'] . ' | ' . $row['nom'] . ' ' . $row['prenom'] . ' | ' . $row['email'] . ' | role=' . $row['role'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n=== DEMANDES COUNT ===\n";
try {
    $count = $db->query("SELECT COUNT(*) as cnt FROM demandes")->fetch();
    echo "Total: " . $count['cnt'] . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
