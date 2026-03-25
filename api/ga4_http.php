<?php
declare(strict_types=1);

/**
 * GA4 Data API — OAuth2 conta de serviço + REST (sem Composer).
 * @see https://developers.google.com/analytics/devguides/reporting/data/v1/rest
 */

function ga4_base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/** @return array<string, mixed> */
function ga4_load_credentials(string $path): array
{
    if (!is_file($path)) {
        throw new RuntimeException('Arquivo de credenciais não encontrado.');
    }
    $json = json_decode((string) file_get_contents($path), true);
    if (!is_array($json) || empty($json['client_email']) || empty($json['private_key'])) {
        throw new RuntimeException('JSON de credenciais inválido (precisa de client_email e private_key).');
    }

    return $json;
}

function ga4_jwt(array $creds): string
{
    $header = ga4_base64url_encode(json_encode(['alg' => 'RS256', 'typ' => 'JWT'], JSON_UNESCAPED_SLASHES));
    $now = time();
    $payload = ga4_base64url_encode(json_encode([
        'iss' => $creds['client_email'],
        'scope' => 'https://www.googleapis.com/auth/analytics.readonly',
        'aud' => 'https://oauth2.googleapis.com/token',
        'iat' => $now,
        'exp' => $now + 3600,
    ], JSON_UNESCAPED_SLASHES));
    $data = $header . '.' . $payload;
    $key = openssl_pkey_get_private($creds['private_key']);
    if ($key === false) {
        throw new RuntimeException('Chave privada OpenSSL inválida.');
    }
    $sig = '';
    if (!openssl_sign($data, $sig, $key, OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('Falha ao assinar JWT.');
    }

    return $data . '.' . ga4_base64url_encode($sig);
}

function ga4_access_token(array $creds): string
{
    $jwt = ga4_jwt($creds);
    $post = http_build_query([
        'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion' => $jwt,
    ]);
    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $post,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        CURLOPT_TIMEOUT => 30,
    ]);
    $raw = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($raw === false) {
        throw new RuntimeException('Falha de rede ao obter token OAuth.');
    }
    /** @var array<string, mixed>|null $d */
    $d = json_decode($raw, true);
    if ($code !== 200 || empty($d['access_token']) || !is_string($d['access_token'])) {
        $err = is_array($d) ? ($d['error_description'] ?? $d['error'] ?? $raw) : $raw;

        throw new RuntimeException(is_string($err) ? $err : 'Resposta OAuth inválida.');
    }

    return $d['access_token'];
}

/**
 * @param array<string, mixed> $body
 * @return array<string, mixed>
 */
function ga4_api_post(string $propertyId, string $accessToken, string $method, array $body): array
{
    $url = 'https://analyticsdata.googleapis.com/v1beta/properties/' . rawurlencode($propertyId) . ':' . $method;
    $json = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $json,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $accessToken,
        ],
        CURLOPT_TIMEOUT => 60,
    ]);
    $raw = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($raw === false) {
        throw new RuntimeException('Erro na requisição à API GA4.');
    }
    /** @var array<string, mixed>|null $d */
    $d = json_decode($raw, true);
    if ($code >= 400) {
        $msg = '';
        if (is_array($d) && isset($d['error']) && is_array($d['error'])) {
            $msg = (string) ($d['error']['message'] ?? '');
        }
        if ($msg === '') {
            $msg = is_string($raw) ? $raw : 'Erro GA4';
        }

        throw new RuntimeException($msg);
    }

    return is_array($d) ? $d : [];
}

/** @return array{startDate: string, endDate: string} */
function ga4_date_range(string $range): array
{
    switch ($range) {
        case 'today':
            return ['startDate' => 'today', 'endDate' => 'today'];
        case '30d':
            return ['startDate' => '30daysAgo', 'endDate' => 'today'];
        case '90d':
            return ['startDate' => '90daysAgo', 'endDate' => 'today'];
        case '7d':
        default:
            return ['startDate' => '7daysAgo', 'endDate' => 'today'];
    }
}

/**
 * Primeira linha de relatório sem dimensões → mapa nome métrica → valor.
 *
 * @param array<string, mixed> $response
 * @return array<string, float|int|string>
 */
function ga4_first_row_metrics(array $response): array
{
    $headers = $response['metricHeaders'] ?? [];
    $names = [];
    foreach ($headers as $h) {
        if (is_array($h) && !empty($h['name'])) {
            $names[] = (string) $h['name'];
        }
    }
    $row0 = $response['rows'][0] ?? null;
    if (!is_array($row0)) {
        $out = [];
        foreach ($names as $n) {
            $out[$n] = 0;
        }

        return $out;
    }
    $vals = $row0['metricValues'] ?? [];
    $out = [];
    foreach ($names as $i => $name) {
        $mv = $vals[$i] ?? null;
        $v = is_array($mv) ? ($mv['value'] ?? '0') : '0';
        if (is_numeric($v)) {
            $out[$name] = str_contains((string) $v, '.') ? (float) $v : (int) $v;
        } else {
            $out[$name] = $v;
        }
    }

    return $out;
}

/**
 * Linhas com dimensões + métricas.
 *
 * @param array<string, mixed> $response
 * @return list<array{dimensions: list<string>, metrics: array<string, float|int|string>}>
 */
function ga4_parse_dimension_rows(array $response): array
{
    $dimHeaders = $response['dimensionHeaders'] ?? [];
    $metricHeaders = $response['metricHeaders'] ?? [];
    $dimNames = [];
    foreach ($dimHeaders as $h) {
        if (is_array($h) && !empty($h['name'])) {
            $dimNames[] = (string) $h['name'];
        }
    }
    $metNames = [];
    foreach ($metricHeaders as $h) {
        if (is_array($h) && !empty($h['name'])) {
            $metNames[] = (string) $h['name'];
        }
    }
    $rows = $response['rows'] ?? [];
    $out = [];
    foreach ($rows as $row) {
        if (!is_array($row)) {
            continue;
        }
        $dims = [];
        foreach ($row['dimensionValues'] ?? [] as $dv) {
            $dims[] = is_array($dv) ? (string) ($dv['value'] ?? '') : '';
        }
        $metrics = [];
        foreach ($metNames as $mi => $mn) {
            $mv = ($row['metricValues'] ?? [])[$mi] ?? null;
            $v = is_array($mv) ? ($mv['value'] ?? '0') : '0';
            if (is_numeric($v)) {
                $metrics[$mn] = str_contains((string) $v, '.') ? (float) $v : (int) $v;
            } else {
                $metrics[$mn] = $v;
            }
        }
        $out[] = ['dimensions' => $dims, 'metrics' => $metrics];
    }

    return $out;
}
