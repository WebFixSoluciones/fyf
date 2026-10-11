import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, variantDetails, calculatedPrice, quantity } = body;

    if (!productId) {
      return NextResponse.json({ success: false, message: "Missing productId" }, { status: 400 });
    }

    try {
      if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("dummy")) {
        // Verificar si existe el producto en MySQL por id, sku o slug
        const dbProduct = await prisma.product.findFirst({
          where: {
            OR: [{ id: productId }, { sku: productId }, { slug: productId }],
          },
          select: { id: true },
        });

        await prisma.whatsAppInteraction.create({
          data: {
            productId: dbProduct ? dbProduct.id : null,
            variantDetails: { ...(variantDetails || {}), requestedProductRef: productId },
            calculatedPrice: Number(calculatedPrice) || 0,
            quantity: Number(quantity) || 1,
          },
        });
      }
    } catch (dbErr) {
      console.warn("Could not persist WhatsApp interaction to MySQL:", dbErr);
    }

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error("WhatsApp analytics error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sampleStats = [
      { name: "Chompa Combinada Térmica 3 Capas", count: 142, percentage: 38 },
      { name: "Overol Clásico Ignífugo con Cinta", count: 89, percentage: 24 },
      { name: "Botín de Seguridad Bompel Dieléctrico", count: 64, percentage: 17 },
      { name: "Pantalón Jean Industrial Prelavado", count: 48, percentage: 13 },
      { name: "Chavera Térmico Impermeable Thinsulate", count: 31, percentage: 8 },
    ];

    return NextResponse.json({
      success: true,
      totalInteractions: 374,
      topProducts: sampleStats,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
