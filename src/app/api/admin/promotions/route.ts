import { NextResponse } from "next/server";
import { getPromotionsConfig, updatePromotionsConfig, resetPromotionsConfig } from "@/lib/promotions-store";
import { getAdminSession } from "@/lib/auth";

// GET: Obtener configuración de promociones (Público para Home y Navbar)
export async function GET() {
  try {
    const promotions = getPromotionsConfig();
    return NextResponse.json(
      { success: true, promotions },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST: Actualizar configuración de promociones (Requiere sesión de admin o colaborador)
export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Sesión no válida o expirada. Inicia sesión nuevamente." },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (body?.action === "reset") {
      const reset = resetPromotionsConfig();
      return NextResponse.json({ success: true, promotions: reset, message: "Configuración restablecida a valores de fábrica" });
    }

    const updated = updatePromotionsConfig(body);
    return NextResponse.json({ success: true, promotions: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
