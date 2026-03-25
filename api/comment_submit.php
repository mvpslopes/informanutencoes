<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(405, ['ok' => false, 'error' => 'Método não permitido']);
}

$author = trim((string) ($_POST['author_name'] ?? ''));
$rating = (int) ($_POST['rating'] ?? 0);
$body = trim((string) ($_POST['body'] ?? ''));

if ($author === '' || strlen($author) > 120) {
    json_out(400, ['ok' => false, 'error' => 'Nome inválido (máx. 120 caracteres)']);
}
if ($rating < 1 || $rating > 5) {
    json_out(400, ['ok' => false, 'error' => 'Avaliação deve ser de 1 a 5 estrelas']);
}
if ($body === '' || strlen($body) > 5000) {
    json_out(400, ['ok' => false, 'error' => 'Comentário obrigatório (máx. 5000 caracteres)']);
}

$config = load_config();
$photoPath = null;

if (!empty($_FILES['photo']) && is_uploaded_file($_FILES['photo']['tmp_name'])) {
    $f = $_FILES['photo'];
    if ($f['error'] !== UPLOAD_ERR_OK) {
        json_out(400, ['ok' => false, 'error' => 'Erro no envio da foto']);
    }
    if ($f['size'] > $config['upload']['max_bytes']) {
        json_out(400, ['ok' => false, 'error' => 'Foto muito grande (máx. 2 MB)']);
    }
    $info = @getimagesize($f['tmp_name']);
    $allowedTypes = [IMAGETYPE_JPEG, IMAGETYPE_PNG];
    if (defined('IMAGETYPE_WEBP')) {
        $allowedTypes[] = IMAGETYPE_WEBP;
    }
    if (!$info || !in_array($info[2], $allowedTypes, true)) {
        json_out(400, ['ok' => false, 'error' => 'Use JPG, PNG ou WebP']);
    }
    $dir = $config['upload']['avatars_dir'];
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $ext = match ($info[2]) {
        IMAGETYPE_JPEG => 'jpg',
        IMAGETYPE_PNG => 'png',
        IMAGETYPE_WEBP => 'webp',
        default => 'jpg',
    };
    $name = bin2hex(random_bytes(16)) . '.' . $ext;
    $dest = $dir . '/' . $name;
    if (!move_uploaded_file($f['tmp_name'], $dest)) {
        json_out(500, ['ok' => false, 'error' => 'Falha ao salvar imagem']);
    }
    $photoPath = '/api/uploads/avatars/' . $name;
}

$pdo = db();
$st = $pdo->prepare(
    'INSERT INTO site_comments (author_name, author_photo_path, rating, body, status) VALUES (?,?,?,?, \'pending\')'
);
$st->execute([$author, $photoPath, $rating, $body]);

json_out(201, [
    'ok' => true,
    'message' => 'Comentário enviado! Ele aparecerá no site após aprovação da equipe.',
]);
