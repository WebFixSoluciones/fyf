import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";
import { getCustomerSession } from "@/lib/customer-auth";

// Lista blanca estricta de tipos MIME permitidos (solo imágenes y comprobantes PDF)
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

// Límite máximo de tamaño por archivo: 4 MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    // 1. Control de accesos: Solo administradores o clientes autenticados pueden subir archivos
    const adminSession = await getAdminSession();
    const customerSession = await getCustomerSession();

    if (!adminSession && !customerSession) {
      return NextResponse.json(
        { success: false, message: "Acceso no autorizado. Se requiere iniciar sesión." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No se proporcionó ningún archivo." },
        { status: 400 }
      );
    }

    // 2. Validación de Tipo MIME contra ataques de Stored XSS / Ejecutables
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: `Formato de archivo '${file.type}' no permitido. Solo se aceptan imágenes (JPG, PNG, WEBP) o comprobantes PDF.`,
        },
        { status: 415 }
      );
    }

    // 3. Validación de Tamaño Máximo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: `El archivo supera el tamaño máximo permitido de 4 MB.`,
        },
        { status: 413 }
      );
    }

    // 4. Sanitización estricta del nombre de archivo (Prevención de Path Traversal y Null Byte Injection)
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/\.{2,}/g, ".")
      .slice(0, 80);

    const safeFilename = `${Date.now()}_${sanitizedName}`;

    // 5. Si el token de Vercel Blob está configurado en producción
    if (process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_READ_WRITE_TOKEN.includes("dummy")) {
      const blob = await put(`alina-uploads/${safeFilename}`, file, {
        access: "public",
      });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // Fallback de demostración / desarrollo
    return NextResponse.json({
      success: true,
      url: `/images/products/bases-mdf/base-mdf-blanco-wengue.png`,
      note: "Modo seguro de desarrollo local",
    });
  } catch (error: any) {
    console.error("Vercel Blob upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error al procesar archivo." },
      { status: 500 }
    );
  }
}
