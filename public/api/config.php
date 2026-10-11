<?php
/**
 * ============================================================================
 * FYF UNIFORMES - CONFIGURACIÓN DE BASE DE DATOS MYSQL PARA CPANEL (PHP PDO)
 * ============================================================================
 * Edita únicamente las 4 constantes de abajo con los datos de la base de datos
 * MySQL creada en tu cPanel -> MySQL Databases.
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'usuario_cpanel_fyf');      // <-- Cambia por el nombre de tu BD en cPanel
define('DB_USER', 'usuario_cpanel_admin');    // <-- Cambia por tu usuario MySQL de cPanel
define('DB_PASS', 'TuPasswordMySQL2026*');    // <-- Cambia por la contraseña de tu usuario MySQL
define('DB_CHARSET', 'utf8mb4');

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
