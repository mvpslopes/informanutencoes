<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(405, ['ok' => false, 'error' => 'Método não permitido']);
}

if (empty($_FILES['image']) || !is_uploaded_file($_FILES['image']['tmp_name'])) {
    json_out(400, ['ok' => false, 'error' => 'Envie um arquivo de imagem (campo image).']);
}

$config = load_config();
$f = $_FILES['image'];
if ($f['error'] !== UPLOAD_ERR_OK) {
    json_out(400, ['ok' => false, 'error' => 'Erro no envio da imagem']);
}
if ($f['size'] > $config['upload']['max_bytes']) {
    json_out(400, ['ok' => false, 'error' => 'Imagem muito grande (máx. 2 MB)']);
}

$info = @getimagesize($f['tmp_name']);
$allowedTypes = [IMAGETYPE_JPEG, IMAGETYPE_PNG];
if (defined('IMAGETYPE_WEBP')) {
    $allowedTypes[] = IMAGETYPE_WEBP;
}
if (!$info || !in_array($info[2], $allowedTypes, true)) {
    json_out(400, ['ok' => false, 'error' => 'Use JPG, PNG ou WebP']);
}

$dir = $config['upload']['products_dir'] ?? (__DIR__ . '/uploads/products');
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}

$ext = match ($info[2]) {
    IMAGETYPE_JPEG => 'jpg',
    IMAGETYPE_PNG => 'png',
    IMAGETYPE_WEBP => 'webp',
    default => 'jpg',
};
$name = 'p_' . bin2hex(random_bytes(12)) . '.' . $ext;
$dest = $dir . DIRECTORY_SEPARATOR . $name;
if (!move_uploaded_file($f['tmp_name'], $dest)) {
    json_out(500, ['ok' => false, 'error' => 'Falha ao salvar imagem']);
}

$publicPath = '/api/uploads/products/' . $name;
json_out(200, ['ok' => true, 'path' => $publicPath]);
