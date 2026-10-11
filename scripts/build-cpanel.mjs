import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const rootDir = process.cwd();
const apiDir = path.join(rootDir, "src", "app", "api");
const backupApiDir = path.join(rootDir, ".tmp_api_backup");
const outDir = path.join(rootDir, "out");
const zipPath = path.join(rootDir, "cpanel_public_html.zip");

console.log("🚀 Generando paquete estático + API PHP/MySQL para cPanel (Sin Node.js)...");

try {
  // 1. Mover temporalmente src/app/api fuera de src/app para permitir output: 'export'
  if (fs.existsSync(apiDir)) {
    if (fs.existsSync(backupApiDir)) {
      fs.rmSync(backupApiDir, { recursive: true, force: true });
    }
    fs.renameSync(apiDir, backupApiDir);
  }

  // 2. Limpiar caché de tipos de .next antes del export estático
  const nextTypesDir = path.join(rootDir, ".next");
  if (fs.existsSync(nextTypesDir)) {
    fs.rmSync(nextTypesDir, { recursive: true, force: true });
  }

  // 3. Ejecutar next build en modo estático para cPanel
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      CPANEL_STATIC: "true",
    },
  });

  // 4. Asegurar que .htaccess esté incluido dentro de out/
  const htaccessSrc = path.join(rootDir, "public", ".htaccess");
  const htaccessDest = path.join(outDir, ".htaccess");
  if (fs.existsSync(htaccessSrc) && fs.existsSync(outDir)) {
    fs.copyFileSync(htaccessSrc, htaccessDest);
  }

  // 5. Crear archivo comprimido cpanel_public_html.zip listo para subir a cPanel
  if (fs.existsSync(outDir)) {
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    console.log("📦 Comprimiendo carpeta out/ en cpanel_public_html.zip...");
    execSync(`tar -a -c -f "${zipPath}" -C "${outDir}" .`, { stdio: "inherit" });
  }

  console.log("\n✅ Paquete para cPanel generado exitosamente:");
  console.log("   📁 Carpeta lista para public_html: ./out");
  console.log("   🗜️  Archivo ZIP para subir directo a cPanel: ./cpanel_public_html.zip");
  console.log("   🗄️  Base de datos MySQL para phpMyAdmin: ./database/mysql_cpanel.sql");
} finally {
  // Restaurar siempre src/app/api
  if (fs.existsSync(backupApiDir)) {
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
    }
    fs.renameSync(backupApiDir, apiDir);
  }
}
