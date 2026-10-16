import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

// GET: Obtener ajustes generales de la tienda (números WhatsApp, Payphone, tarifas de envío)
export async function GET() {
  try {
    let settings = null;
    try {
      settings = await prisma.storeSettings.findUnique({
        where: { id: "default" },
      });
    } catch (dbErr) {
      console.warn("No se pudo leer StoreSettings desde Prisma:", dbErr);
    }

    if (!settings) {
      // Valores por defecto seguros para FYF Uniformes
      settings = {
        id: "default",
        whatsappPrimary: "593993358701",
        whatsappSecondary: "593988742584",
        whatsappActiveNumber: "593993358701",
        whatsappTemplate: "Hola FYF Uniformes, deseo realizar este pedido: *{orderNumber}* por un valor de *{total}*.",
        payphoneAppId: process.env.PAYPHONE_APP_ID || "live_app_fyf_uniformes",
        payphoneClientId: process.env.PAYPHONE_CLIENT_ID || "live_client_fyf_uniformes",
        payphoneToken: process.env.PAYPHONE_TOKEN || "",
        payphoneIsSandbox: process.env.PAYPHONE_IS_SANDBOX !== "false",
        shippingBasePichincha: 3.50 as any,
        shippingBaseNational: 5.50 as any,
        promotionsJson: null,
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      settings: {
        whatsappPrimary: settings.whatsappPrimary || "593993358701",
        whatsappSecondary: settings.whatsappSecondary || "593988742584",
        whatsappActive: settings.whatsappActiveNumber || "593993358701",
        whatsappTemplate: settings.whatsappTemplate,
        payphoneAppId: settings.payphoneAppId || "live_app_fyf_uniformes",
        payphoneClientId: settings.payphoneClientId || "live_client_fyf_uniformes",
        payphoneToken: settings.payphoneToken || "",
        payphoneIsSandbox: Boolean(settings.payphoneIsSandbox),
        shippingPichincha: Number(settings.shippingBasePichincha || 3.50),
        shippingNational: Number(settings.shippingBaseNational || 5.50),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Error al obtener ajustes" },
      { status: 500 }
    );
  }
}

// POST: Actualizar ajustes generales de la tienda en MySQL
export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Sesión no válida o expirada. Inicia sesión como administrador." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const updated = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: {
        whatsappPrimary: body.whatsappPrimary || "593993358701",
        whatsappSecondary: body.whatsappSecondary || "593988742584",
        whatsappActiveNumber: body.whatsappActive || body.whatsappActiveNumber || "593993358701",
        whatsappTemplate: body.whatsappTemplate || undefined,
        payphoneAppId: body.payphoneAppId || null,
        payphoneClientId: body.payphoneClientId || null,
        payphoneToken: body.payphoneToken || null,
        payphoneIsSandbox: Boolean(body.payphoneIsSandbox),
        shippingBasePichincha: body.shippingPichincha !== undefined ? Number(body.shippingPichincha) : undefined,
        shippingBaseNational: body.shippingNational !== undefined ? Number(body.shippingNational) : undefined,
      },
      create: {
        id: "default",
        whatsappPrimary: body.whatsappPrimary || "593993358701",
        whatsappSecondary: body.whatsappSecondary || "593988742584",
        whatsappActiveNumber: body.whatsappActive || body.whatsappActiveNumber || "593993358701",
        whatsappTemplate: body.whatsappTemplate || "Hola FYF Uniformes, deseo realizar este pedido: *{orderNumber}* por un valor de *{total}*.",
        payphoneAppId: body.payphoneAppId || null,
        payphoneClientId: body.payphoneClientId || null,
        payphoneToken: body.payphoneToken || null,
        payphoneIsSandbox: Boolean(body.payphoneIsSandbox),
        shippingBasePichincha: Number(body.shippingPichincha || 3.50),
        shippingBaseNational: Number(body.shippingNational || 5.50),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ajustes de tienda y pasarela Payphone guardados exitosamente.",
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Error al guardar ajustes" },
      { status: 500 }
    );
  }
}
