<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(405, ['ok' => false, 'error' => 'Método não permitido']);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];
$username = trim((string) ($data['username'] ?? ''));
$password = (string) ($data['password'] ?? '');

if ($username === '' || $password === '') {
    json_out(400, ['ok' => false, 'error' => 'Usuário e senha obrigatórios']);
}

try {
    $pdo = db();
    $st = $pdo->prepare('SELECT id, username, password_hash, role, full_name FROM users WHERE username = ? LIMIT 1');
    $st->execute([$username]);
    $row = $st->fetch();
    if (!$row || !password_verify($password, (string) $row['password_hash'])) {
        json_out(401, ['ok' => false, 'error' => 'Credenciais inválidas']);
    }

    $_SESSION['uid'] = (int) $row['id'];
    $_SESSION['username'] = $row['username'];
    $_SESSION['role'] = $row['role'];

    json_out(200, [
        'ok' => true,
        'user' => [
            'id' => (int) $row['id'],
            'username' => $row['username'],
            'role' => $row['role'],
            'full_name' => $row['full_name'],
        ],
    ]);
} catch (PDOException) {
    json_out(500, [
        'ok' => false,
        'error' => 'Não foi possível conectar ao MySQL. Confira em config.php: host, nome do banco, usuário e senha (painel Hostinger → Bancos de dados).',
    ]);
} catch (Throwable) {
    json_out(500, [
        'ok' => false,
        'error' => 'Erro interno no servidor. Verifique os logs PHP ou a sintaxe de config.php.',
    ]);
}
