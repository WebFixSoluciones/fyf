import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("id");
    const clientTxId = searchParams.get("clientTransactionId") || searchParams.get("clientTxId");

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.fyf.com.ec").replace(/\/$/, "");

    if (!paymentId || !clientTxId) {
      return NextResponse.redirect(`${appUrl}/catalogo`);
    }

    // 1. Obtener token de Payphone
    let payphoneToken = process.env.PAYPHONE_TOKEN || "";
    try {
      const settings = await prisma.storeSettings.findUnique({ where: { id: "default" } });
      if (settings?.payphoneToken) {
        payphoneToken = settings.payphoneToken;
      }
    } catch {}

    let isApproved = false;

    // 2. Si hay token, confirmar con la API de Payphone
    if (payphoneToken && payphoneToken.length > 10) {
      try {
        const confirmRes = await fetch("https://pay.payphonetodoesposible.com/api/button/Confirm", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${payphoneToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: Number(paymentId),
            clientTxId: clientTxId,
          }),
        });

        const confirmData = await confirmRes.json();
        if (confirmData.transactionStatus === "Approved" || confirmData.statusCode === 3) {
          isApproved = true;
        }
      } catch (err) {
        console.error("Error al confirmar transacción con Payphone:", err);
      }
    } else {
      // En pruebas sin token live, asumir aprobado
      isApproved = true;
    }

    // 3. Actualizar el estado del pedido en la base de datos MySQL
    try {
      await prisma.order.update({
        where: { orderNumber: clientTxId },
        data: {
          paymentStatus: isApproved ? "PAGADO" : "RECHAZADO",
          orderStatus: isApproved ? "PAGADO" : "PENDIENTE",
          payphoneTransactionId: String(paymentId),
        },
      });
    } catch (err) {
      console.warn("No se pudo actualizar pedido en MySQL:", err);
    }

    const redirectStatus = isApproved ? "approved" : "rejected";
    return NextResponse.redirect(
      `${appUrl}/pedido/confirmado/exito?num=${encodeURIComponent(clientTxId)}&method=payphone&status=${redirectStatus}`
    );
  } catch (err: any) {
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.fyf.com.ec").replace(/\/$/, "");
    return NextResponse.redirect(`${appUrl}/catalogo`);
  }
}
