<?php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax',
        'name' => 'INFORSESSID',
    ]);
}

header('Content-Type: application/json; charset=utf-8');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://informanutencoes.com.br',
    'https://www.informanutencoes.com.br',
];
if (in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-HTTP-Method-Override');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function json_out(int $code, array $data): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function load_config(): array
{
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        json_out(500, ['ok' => false, 'error' => 'config.php não encontrado. Copie config.example.php para config.php.']);
    }
    return require $path;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo) {
        return $pdo;
    }
    $c = load_config()['db'];
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $c['host'],
        $c['name'],
        $c['charset']
    );
    $pdo = new PDO($dsn, $c['user'], $c['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

function require_login(): array
{
    if (empty($_SESSION['uid']) || empty($_SESSION['role'])) {
        json_out(401, ['ok' => false, 'error' => 'Não autenticado']);
    }
    return [
        'id' => (int) $_SESSION['uid'],
        'username' => $_SESSION['username'] ?? '',
        'role' => $_SESSION['role'],
    ];
}

function require_root(): array
{
    $u = require_login();
    if ($u['role'] !== 'root') {
        json_out(403, ['ok' => false, 'error' => 'Apenas Root pode executar esta ação']);
    }
    return $u;
}
