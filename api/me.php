<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(405, ['ok' => false, 'error' => 'Método não permitido']);
}

if (empty($_SESSION['uid'])) {
    json_out(200, ['ok' => true, 'user' => null]);
}

$pdo = db();
$st = $pdo->prepare('SELECT id, username, role, full_name FROM users WHERE id = ? LIMIT 1');
$st->execute([(int) $_SESSION['uid']]);
$row = $st->fetch();
if (!$row) {
    json_out(200, ['ok' => true, 'user' => null]);
}

json_out(200, [
    'ok' => true,
    'user' => [
        'id' => (int) $row['id'],
        'username' => $row['username'],
        'role' => $row['role'],
        'full_name' => $row['full_name'],
    ],
]);
