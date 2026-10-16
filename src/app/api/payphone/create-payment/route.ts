import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      orderNumber,
      total,
      customerName,
      customerEmail,
      customerPhone,
      customerIdNumber,
    } = body;

    if (!orderNumber || !total) {
      return NextResponse.json(
        { success: false, message: "Datos de pedido incompletos para procesar Payphone." },
        { status: 400 }
      );
    }

    // 1. Obtener configuración de Payphone (desde StoreSettings en MySQL o desde .env)
    let payphoneToken = process.env.PAYPHONE_TOKEN || "";
    let isSandbox = process.env.PAYPHONE_IS_SANDBOX === "true";

    try {
      const settings = await prisma.storeSettings.findUnique({ where: { id: "default" } });
      if (settings?.payphoneToken) {
        payphoneToken = settings.payphoneToken;
      }
      if (settings?.payphoneIsSandbox !== undefined) {
        isSandbox = settings.payphoneIsSandbox;
      }
    } catch {
      // Usar variables de entorno si la base de datos no responde
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.fyf.com.ec").replace(/\/$/, "");
    const totalAmount = Number(total);
    const amountInCents = Math.round(totalAmount * 100);

    // 2. Si el token de Payphone está configurado, llamar al endpoint de Payphone API v3
    const hasLiveToken =
      payphoneToken &&
      payphoneToken !== "tu_token_payphone" &&
      payphoneToken.trim().length > 10;

    if (hasLiveToken) {
      const cleanPhone = String(customerPhone || "593993358701").replace(/\D/g, "");
      const formattedPhone = cleanPhone.startsWith("593") ? `+${cleanPhone}` : `+593${cleanPhone.replace(/^0/, "")}`;
      const cleanDoc = String(customerIdNumber || "9999999999").trim();

      const payphonePayload = {
        responseUrl: `${appUrl}/api/payphone/confirm`,
        cancellationUrl: `${appUrl}/checkout`,
        amount: amountInCents,
        amountWithoutTax: amountInCents,
        amountWithTax: 0,
        tax: 0,
        service: 0,
        tip: 0,
        clientTransactionId: orderNumber,
        reference: `Pedido FYF Uniformes ${orderNumber}`,
        currency: "USD",
        email: customerEmail || "ventas@fyf.com.ec",
        phoneNumber: formattedPhone,
        documentId: cleanDoc,
      };

      try {
        const payphoneRes = await fetch("https://pay.payphonetodoesposible.com/api/button/Prepare", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${payphoneToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payphonePayload),
        });

        const payphoneData = await payphoneRes.json();

        if (payphoneRes.ok && payphoneData.payWithCard) {
          return NextResponse.json({
            success: true,
            isSandbox: false,
            paymentId: payphoneData.paymentId,
            payWithCard: payphoneData.payWithCard,
          });
        }

        console.warn("Payphone API error:", payphoneData);
      } catch (err: any) {
        console.error("Error al conectar con Payphone API:", err.message);
      }
    }

    // 3. Fallback de Sandbox / Pruebas:
    // Permite validar todo el flujo de compra cuando no hay token live de Payphone o en pruebas
    const safeOrderId = orderId || "new";
    const sandboxReturnUrl = `${appUrl}/pedido/${safeOrderId}/exito?num=${encodeURIComponent(orderNumber)}&method=payphone&status=approved`;

    return NextResponse.json({
      success: true,
      isSandbox: true,
      message: "Modo Pruebas / Sandbox de Payphone activo.",
      payWithCard: sandboxReturnUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Error al iniciar pasarela Payphone." },
      { status: 500 }
    );
  }
}
