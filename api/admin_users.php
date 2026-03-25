<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = db();

if ($method === 'GET') {
    require_login();
    $st = $pdo->query('SELECT id, username, role, full_name, created_at FROM users ORDER BY id ASC');
    json_out(200, ['ok' => true, 'users' => $st->fetchAll()]);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];

if ($method === 'POST') {
    require_root();
    $username = trim((string) ($data['username'] ?? ''));
    $password = (string) ($data['password'] ?? '');
    $role = $data['role'] ?? 'admin';
    $fullName = trim((string) ($data['full_name'] ?? ''));

    if ($username === '' || strlen($username) > 64) {
        json_out(400, ['ok' => false, 'error' => 'Usuário inválido']);
    }
    if (strlen($password) < 8) {
        json_out(400, ['ok' => false, 'error' => 'Senha com no mínimo 8 caracteres']);
    }
    if (!in_array($role, ['root', 'admin'], true)) {
        json_out(400, ['ok' => false, 'error' => 'Perfil inválido']);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    try {
        $st = $pdo->prepare('INSERT INTO users (username, password_hash, role, full_name) VALUES (?,?,?,?)');
        $st->execute([$username, $hash, $role, $fullName ?: null]);
    } catch (PDOException $e) {
        if (str_contains($e->getMessage(), 'Duplicate')) {
            json_out(409, ['ok' => false, 'error' => 'Usuário já existe']);
        }
        throw $e;
    }
    json_out(201, ['ok' => true, 'id' => (int) $pdo->lastInsertId()]);
}

if ($method === 'PUT') {
    $actor = require_login();
    $id = (int) ($data['id'] ?? 0);
    if ($id < 1) {
        json_out(400, ['ok' => false, 'error' => 'id obrigatório']);
    }

    // Root pode editar qualquer um; Admin só a si mesmo (senha)
    if ($actor['role'] !== 'root' && $actor['id'] !== $id) {
        json_out(403, ['ok' => false, 'error' => 'Sem permissão']);
    }

    if ($actor['role'] === 'root') {
        if (isset($data['role']) && in_array($data['role'], ['root', 'admin'], true)) {
            $pdo->prepare('UPDATE users SET role = ? WHERE id = ?')->execute([$data['role'], $id]);
        }
        if (isset($data['full_name'])) {
            $pdo->prepare('UPDATE users SET full_name = ? WHERE id = ?')->execute([$data['full_name'], $id]);
        }
    }

    if (!empty($data['password'])) {
        if (strlen($data['password']) < 8) {
            json_out(400, ['ok' => false, 'error' => 'Senha com no mínimo 8 caracteres']);
        }
        if ($actor['role'] !== 'root' && $actor['id'] !== $id) {
            json_out(403, ['ok' => false, 'error' => 'Sem permissão']);
        }
        $hash = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);
        $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$hash, $id]);
    }

    json_out(200, ['ok' => true]);
}

json_out(405, ['ok' => false, 'error' => 'Método não permitido']);
