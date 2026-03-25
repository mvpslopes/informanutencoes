<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$user = require_login();
$method = $_SERVER['REQUEST_METHOD'];
$pdo = db();

if ($method === 'GET') {
    $status = $_GET['status'] ?? 'pending';
    if (!in_array($status, ['pending', 'approved', 'rejected', 'all'], true)) {
        $status = 'pending';
    }
    $sql = 'SELECT c.*, u.username AS moderator_username
            FROM site_comments c
            LEFT JOIN users u ON u.id = c.moderated_by_user_id';
    if ($status === 'all') {
        $sql .= ' ORDER BY c.created_at DESC';
        $st = $pdo->query($sql);
    } else {
        $sql .= ' WHERE c.status = ? ORDER BY c.created_at DESC';
        $st = $pdo->prepare($sql);
        $st->execute([$status]);
    }
    json_out(200, ['ok' => true, 'comments' => $st->fetchAll()]);
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?: [];
    $id = (int) ($data['id'] ?? 0);
    $action = $data['action'] ?? '';
    if ($id < 1 || !in_array($action, ['approve', 'reject'], true)) {
        json_out(400, ['ok' => false, 'error' => 'id e action (approve|reject) obrigatórios']);
    }
    $newStatus = $action === 'approve' ? 'approved' : 'rejected';
    $st = $pdo->prepare(
        'UPDATE site_comments SET status = ?, moderated_by_user_id = ?, moderated_at = NOW() WHERE id = ?'
    );
    $st->execute([$newStatus, $user['id'], $id]);
    json_out(200, ['ok' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id < 1) {
        json_out(400, ['ok' => false, 'error' => 'id obrigatório']);
    }
    $st = $pdo->prepare('SELECT author_photo_path FROM site_comments WHERE id = ?');
    $st->execute([$id]);
    $row = $st->fetch();
    if (!$row) {
        json_out(404, ['ok' => false, 'error' => 'Comentário não encontrado']);
    }
    $photoPath = $row['author_photo_path'] ?? '';
    if ($photoPath !== '' && $photoPath !== null) {
        $config = load_config();
        $prefix = '/api/uploads/avatars/';
        if (str_starts_with($photoPath, $prefix)) {
            $file = $config['upload']['avatars_dir'] . DIRECTORY_SEPARATOR . basename($photoPath);
            if (is_file($file)) {
                @unlink($file);
            }
        }
    }
    $pdo->prepare('DELETE FROM site_comments WHERE id = ?')->execute([$id]);
    json_out(200, ['ok' => true]);
}

json_out(405, ['ok' => false, 'error' => 'Método não permitido']);
