<?php
/**
 * Copie este arquivo para config.php e preencha a senha do MySQL.
 * NUNCA commite config.php no Git.
 */
return [
    'db' => [
        'host' => 'localhost',
        'name' => 'u179630068_infor_bd',
        'user' => 'u179630068_infor_user',
        'pass' => 'COLOQUE_A_SENHA_DO_MYSQL_AQUI',
        'charset' => 'utf8mb4',
    ],
    'upload' => [
        'max_bytes' => 2 * 1024 * 1024, // 2 MB
        'avatars_dir' => __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'avatars',
        'products_dir' => __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'products',
    ],
    /**
     * Relatório GA4 no painel (Google Analytics Data API).
     * - property_id: número em Admin do GA4 → Detalhes da propriedade (não é G-XXXX nem o código do fluxo).
     * - credentials_json: JSON da conta de serviço (Google Cloud) com API "Analytics Data" ativa;
     *   no GA4, adicione o e-mail da conta como Leitor na propriedade.
     */
    'ga4' => [
        'property_id' => '529989721',
        'credentials_json' => __DIR__ . DIRECTORY_SEPARATOR . 'ga-service-account.json',
        'measurement_id' => 'G-HGR7Q4C254',
        'flow_name' => 'Informanutencoes',
        'flow_url' => 'https://informanutencoes.com.br',
    ],
];
