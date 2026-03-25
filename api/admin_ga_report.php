<?php
declare(strict_types=1);

/**
 * Relatório GA4 para o painel (Google Analytics Data API).
 * Requer: propriedade GA4 + conta de serviço com Analytics Data API ativa e acesso Viewer na propriedade.
 */

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ga4_http.php';

$user = require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(405, ['ok' => false, 'error' => 'Método não permitido']);
}

$config = load_config();
$ga4 = $config['ga4'] ?? [];
$propertyId = trim((string) ($ga4['property_id'] ?? ''));
$credPath = (string) ($ga4['credentials_json'] ?? '');

if ($propertyId === '' || !is_file($credPath)) {
    json_out(200, [
        'ok' => false,
        'configured' => false,
        'error' => 'GA4 não configurado: defina ga4.property_id (número em Admin do GA4) e ga4.credentials_json (caminho do JSON da conta de serviço) em config.php.',
    ]);
}

$range = $_GET['range'] ?? '7d';
if (!in_array($range, ['today', '7d', '30d', '90d'], true)) {
    $range = '7d';
}

try {
    $creds = ga4_load_credentials($credPath);
    $token = ga4_access_token($creds);
} catch (Throwable $e) {
    json_out(200, [
        'ok' => false,
        'configured' => true,
        'error' => 'Credenciais GA4: ' . $e->getMessage(),
    ]);
}

$dr = ga4_date_range($range);
$dateRanges = [['startDate' => $dr['startDate'], 'endDate' => $dr['endDate']]];

/**
 * @param callable(string, array): array $run
 * @return array<string, mixed>|null
 */
$safe = static function (callable $run): ?array {
    try {
        return $run();
    } catch (Throwable $e) {
        return null;
    }
};

// --- Resumo (totais do período)
$summaryMetrics = [
    ['name' => 'activeUsers'],
    ['name' => 'newUsers'],
    ['name' => 'sessions'],
    ['name' => 'screenPageViews'],
    ['name' => 'bounceRate'],
    ['name' => 'averageSessionDuration'],
    ['name' => 'eventCount'],
    ['name' => 'sessionConversionRate'],
];

$summaryRaw = null;
try {
    $summaryRaw = ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'metrics' => $summaryMetrics,
    ]);
} catch (Throwable $e) {
    try {
        $summaryRaw = ga4_api_post($propertyId, $token, 'runReport', [
            'dateRanges' => $dateRanges,
            'metrics' => [
                ['name' => 'activeUsers'],
                ['name' => 'sessions'],
                ['name' => 'screenPageViews'],
                ['name' => 'bounceRate'],
                ['name' => 'averageSessionDuration'],
                ['name' => 'eventCount'],
            ],
        ]);
    } catch (Throwable $e2) {
        json_out(200, [
            'ok' => false,
            'configured' => true,
            'error' => 'GA4: ' . $e2->getMessage(),
        ]);
    }
}

$summary = ga4_first_row_metrics($summaryRaw);

// --- Série diária
$byDay = [];
$dailyRaw = $safe(static function () use ($propertyId, $token, $dateRanges): array {
    return ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'dimensions' => [['name' => 'date']],
        'metrics' => [
            ['name' => 'activeUsers'],
            ['name' => 'sessions'],
            ['name' => 'screenPageViews'],
        ],
        'orderBys' => [['dimension' => ['dimensionName' => 'date']]],
    ]);
});
if ($dailyRaw !== null) {
    foreach (ga4_parse_dimension_rows($dailyRaw) as $row) {
        $dateStr = $row['dimensions'][0] ?? '';
        if ($dateStr !== '') {
            $y = substr($dateStr, 0, 4);
            $m = substr($dateStr, 4, 2);
            $d = substr($dateStr, 6, 2);
            $byDay[] = [
                'date' => $dateStr,
                'label' => $d . '/' . $m,
                'activeUsers' => (int) ($row['metrics']['activeUsers'] ?? 0),
                'sessions' => (int) ($row['metrics']['sessions'] ?? 0),
                'screenPageViews' => (int) ($row['metrics']['screenPageViews'] ?? 0),
            ];
        }
    }
}

// --- Tempo real: usuários ativos agora
$realtimeUsers = 0;
$rtRaw = $safe(static function () use ($propertyId, $token): array {
    return ga4_api_post($propertyId, $token, 'runRealtimeReport', [
        'metrics' => [['name' => 'activeUsers']],
    ]);
});
if ($rtRaw !== null && !empty($rtRaw['rows'][0]['metricValues'][0]['value'])) {
    $realtimeUsers = (int) $rtRaw['rows'][0]['metricValues'][0]['value'];
}

// --- Dispositivos
$devices = [];
$devRaw = $safe(static function () use ($propertyId, $token, $dateRanges): array {
    return ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'dimensions' => [['name' => 'deviceCategory']],
        'metrics' => [['name' => 'sessions']],
        'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
        'limit' => 10,
    ]);
});
if ($devRaw !== null) {
    foreach (ga4_parse_dimension_rows($devRaw) as $row) {
        $devices[] = [
            'label' => $row['dimensions'][0] ?? '(n/d)',
            'sessions' => (int) ($row['metrics']['sessions'] ?? 0),
        ];
    }
}

// --- Canal (origem)
$channels = [];
$chRaw = $safe(static function () use ($propertyId, $token, $dateRanges): array {
    return ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'dimensions' => [['name' => 'sessionDefaultChannelGroup']],
        'metrics' => [['name' => 'sessions']],
        'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
        'limit' => 12,
    ]);
});
if ($chRaw !== null) {
    foreach (ga4_parse_dimension_rows($chRaw) as $row) {
        $channels[] = [
            'label' => $row['dimensions'][0] ?? '(n/d)',
            'sessions' => (int) ($row['metrics']['sessions'] ?? 0),
        ];
    }
}

// --- País
$countries = [];
$coRaw = $safe(static function () use ($propertyId, $token, $dateRanges): array {
    return ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'dimensions' => [['name' => 'country']],
        'metrics' => [['name' => 'sessions']],
        'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
        'limit' => 15,
    ]);
});
if ($coRaw !== null) {
    foreach (ga4_parse_dimension_rows($coRaw) as $row) {
        $countries[] = [
            'label' => $row['dimensions'][0] ?? '(n/d)',
            'sessions' => (int) ($row['metrics']['sessions'] ?? 0),
        ];
    }
}

// --- Cidade
$cities = [];
$ciRaw = $safe(static function () use ($propertyId, $token, $dateRanges): array {
    return ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'dimensions' => [['name' => 'city'], ['name' => 'country']],
        'metrics' => [['name' => 'sessions']],
        'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
        'limit' => 15,
    ]);
});
if ($ciRaw !== null) {
    foreach (ga4_parse_dimension_rows($ciRaw) as $row) {
        $city = $row['dimensions'][0] ?? '';
        $country = $row['dimensions'][1] ?? '';
        $label = $city !== '' ? ($city . ($country !== '' ? ', ' . $country : '')) : '(n/d)';
        $cities[] = [
            'label' => $label,
            'sessions' => (int) ($row['metrics']['sessions'] ?? 0),
        ];
    }
}

// --- Navegadores
$browsers = [];
$brRaw = $safe(static function () use ($propertyId, $token, $dateRanges): array {
    return ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'dimensions' => [['name' => 'browser']],
        'metrics' => [['name' => 'sessions']],
        'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
        'limit' => 10,
    ]);
});
if ($brRaw !== null) {
    foreach (ga4_parse_dimension_rows($brRaw) as $row) {
        $browsers[] = [
            'label' => $row['dimensions'][0] ?? '(n/d)',
            'sessions' => (int) ($row['metrics']['sessions'] ?? 0),
        ];
    }
}

// --- SO
$systems = [];
$osRaw = $safe(static function () use ($propertyId, $token, $dateRanges): array {
    return ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'dimensions' => [['name' => 'operatingSystem']],
        'metrics' => [['name' => 'sessions']],
        'orderBys' => [['metric' => ['metricName' => 'sessions'], 'desc' => true]],
        'limit' => 10,
    ]);
});
if ($osRaw !== null) {
    foreach (ga4_parse_dimension_rows($osRaw) as $row) {
        $systems[] = [
            'label' => $row['dimensions'][0] ?? '(n/d)',
            'sessions' => (int) ($row['metrics']['sessions'] ?? 0),
        ];
    }
}

// --- Horários de pico (hora do dia 0–23)
$peakHours = [];
$phRaw = $safe(static function () use ($propertyId, $token, $dateRanges): array {
    return ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'dimensions' => [['name' => 'hour']],
        'metrics' => [['name' => 'sessions']],
        'orderBys' => [['dimension' => ['dimensionName' => 'hour']]],
        'limit' => 24,
    ]);
});
if ($phRaw !== null) {
    foreach (ga4_parse_dimension_rows($phRaw) as $row) {
        $h = (int) ($row['dimensions'][0] ?? -1);
        if ($h >= 0 && $h <= 23) {
            $peakHours[] = [
                'hour' => $h,
                'label' => str_pad((string) $h, 2, '0', STR_PAD_LEFT) . ':00',
                'sessions' => (int) ($row['metrics']['sessions'] ?? 0),
            ];
        }
    }
}

// --- Dia da semana (0=domingo no GA4)
$weekday = [];
$wdRaw = $safe(static function () use ($propertyId, $token, $dateRanges): array {
    return ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'dimensions' => [['name' => 'dayOfWeek']],
        'metrics' => [['name' => 'sessions']],
        'orderBys' => [['dimension' => ['dimensionName' => 'dayOfWeek']]],
        'limit' => 7,
    ]);
});
if ($wdRaw !== null) {
    $wdLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    foreach (ga4_parse_dimension_rows($wdRaw) as $row) {
        $dow = (int) ($row['dimensions'][0] ?? 0);
        $weekday[] = [
            'day' => $dow,
            'label' => $wdLabels[$dow] ?? (string) $dow,
            'sessions' => (int) ($row['metrics']['sessions'] ?? 0),
        ];
    }
}

// --- Eventos (top eventos = “interações”)
$topEvents = [];
$evRaw = $safe(static function () use ($propertyId, $token, $dateRanges): array {
    return ga4_api_post($propertyId, $token, 'runReport', [
        'dateRanges' => $dateRanges,
        'dimensions' => [['name' => 'eventName']],
        'metrics' => [['name' => 'eventCount']],
        'orderBys' => [['metric' => ['metricName' => 'eventCount'], 'desc' => true]],
        'limit' => 15,
    ]);
});
if ($evRaw !== null) {
    foreach (ga4_parse_dimension_rows($evRaw) as $row) {
        $topEvents[] = [
            'label' => $row['dimensions'][0] ?? '(n/d)',
            'count' => (int) ($row['metrics']['eventCount'] ?? 0),
        ];
    }
}

$au = (int) ($summary['activeUsers'] ?? 0);
$sess = (int) ($summary['sessions'] ?? 0);
$pv = (int) ($summary['screenPageViews'] ?? 0);
$avgPerVisitor = $au > 0 ? round($sess / $au, 2) : 0;

json_out(200, [
    'ok' => true,
    'configured' => true,
    'range' => $range,
    'propertyId' => $propertyId,
    'measurementId' => (string) ($ga4['measurement_id'] ?? 'G-HGR7Q4C254'),
    'flowName' => (string) ($ga4['flow_name'] ?? 'Informanutencoes'),
    'flowUrl' => (string) ($ga4['flow_url'] ?? 'https://informanutencoes.com.br'),
    'summary' => [
        'realtimeActiveUsers' => $realtimeUsers,
        'activeUsers' => $au,
        'newUsers' => (int) ($summary['newUsers'] ?? 0),
        'sessions' => $sess,
        'screenPageViews' => $pv,
        'bounceRate' => isset($summary['bounceRate']) ? round((float) $summary['bounceRate'] * 100, 2) : null,
        'averageSessionDuration' => isset($summary['averageSessionDuration']) ? round((float) $summary['averageSessionDuration'], 1) : null,
        'eventCount' => (int) ($summary['eventCount'] ?? 0),
        'sessionConversionRate' => isset($summary['sessionConversionRate'])
            ? round((float) $summary['sessionConversionRate'] * 100, 2)
            : null,
        'avgSessionsPerUser' => $avgPerVisitor,
    ],
    'byDay' => $byDay,
    'peakHours' => $peakHours,
    'weekday' => $weekday,
    'devices' => $devices,
    'channels' => $channels,
    'countries' => $countries,
    'cities' => $cities,
    'browsers' => $browsers,
    'operatingSystems' => $systems,
    'topEvents' => $topEvents,
]);
