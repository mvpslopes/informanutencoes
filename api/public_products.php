<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(405, ['ok' => false, 'error' => 'Método não permitido']);
}

$pdo = db();
$st = $pdo->query(
    'SELECT id, category, name, description, price_display, price_decimal, image_path, tag, tag_color, img_position, sort_order
     FROM products WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
);
$rows = $st->fetchAll();
$list = [];
foreach ($rows as $r) {
    $list[] = [
        'id' => (string) $r['id'],
        'category' => $r['category'],
        'name' => $r['name'],
        'desc' => $r['description'] ?? '',
        'price' => $r['price_display'],
        'priceNum' => (float) $r['price_decimal'],
        'image' => $r['image_path'],
        'tag' => $r['tag'],
        'tagColor' => $r['tag_color'],
        'imgPosition' => $r['img_position'] ?? 'center center',
    ];
}

json_out(200, ['ok' => true, 'products' => $list]);
