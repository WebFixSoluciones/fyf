<?php
/**
 * ============================================================================
 * FYF UNIFORMES - CONFIGURACIÓN DE BASE DE DATOS MYSQL PARA CPANEL (PHP PDO)
 * ============================================================================
 * Edita únicamente las 4 constantes de abajo con los datos de la base de datos
 * MySQL creada en tu cPanel -> MySQL Databases.
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'fyfcomec_dbtienda');
define('DB_USER', 'fyfcomec_dbtienda');
define('DB_PASS', 'Niv{Q6zrWmXxvKnT');
define('DB_CHARSET', 'utf8mb4');

// Configuración Pasarela Payphone Ecuador
define('PAYPHONE_APP_ID', 'live_app_fyf_uniformes');
define('PAYPHONE_CLIENT_ID', 'live_client_fyf_uniformes');
define('PAYPHONE_TOKEN', '');
define('PAYPHONE_IS_SANDBOX', true);

/**
 * Obtiene la conexión PDO a MySQL.
 */
function getDbConnection(): ?PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        return null;
    }
}

/**
 * Genera un ID único estilo CUID/UUID corto para las tablas.
 */
function generateId(string $prefix = 'fyf'): string {
    return $prefix . '_' . bin2hex(random_bytes(8));
}
