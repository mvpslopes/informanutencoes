<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$user = require_login();
$method = $_SERVER['REQUEST_METHOD'];
$pdo = db();

if ($method === 'GET') {
    $st = $pdo->query(
        'SELECT * FROM products ORDER BY sort_order ASC, id ASC'
    );
    json_out(200, ['ok' => true, 'products' => $st->fetchAll()]);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];

if ($method === 'POST') {
    $st = $pdo->prepare(
        'INSERT INTO products (category, name, description, price_display, price_decimal, image_path, tag, tag_color, img_position, sort_order, is_active)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)'
    );
    $st->execute([
        $data['category'] ?? '',
        $data['name'] ?? '',
        $data['description'] ?? '',
        $data['price_display'] ?? '',
        (float) ($data['price_decimal'] ?? 0),
        $data['image_path'] ?? '',
        $data['tag'] ?? null,
        $data['tag_color'] ?? null,
        $data['img_position'] ?? 'center center',
        (int) ($data['sort_order'] ?? 0),
        isset($data['is_active']) ? (int) (bool) $data['is_active'] : 1,
    ]);
    json_out(201, ['ok' => true, 'id' => (int) $pdo->lastInsertId()]);
}

if ($method === 'PUT') {
    $id = (int) ($data['id'] ?? 0);
    if ($id < 1) {
        json_out(400, ['ok' => false, 'error' => 'id obrigatório']);
    }
    $st = $pdo->prepare(
        'UPDATE products SET category=?, name=?, description=?, price_display=?, price_decimal=?, image_path=?, tag=?, tag_color=?, img_position=?, sort_order=?, is_active=? WHERE id=?'
    );
    $st->execute([
        $data['category'] ?? '',
        $data['name'] ?? '',
        $data['description'] ?? '',
        $data['price_display'] ?? '',
        (float) ($data['price_decimal'] ?? 0),
        $data['image_path'] ?? '',
        $data['tag'] ?? null,
        $data['tag_color'] ?? null,
        $data['img_position'] ?? 'center center',
        (int) ($data['sort_order'] ?? 0),
        isset($data['is_active']) ? (int) (bool) $data['is_active'] : 1,
        $id,
    ]);
    json_out(200, ['ok' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id < 1) {
        json_out(400, ['ok' => false, 'error' => 'id obrigatório']);
    }
    $pdo->prepare('DELETE FROM products WHERE id = ?')->execute([$id]);
    json_out(200, ['ok' => true]);
}

json_out(405, ['ok' => false, 'error' => 'Método não permitido']);
