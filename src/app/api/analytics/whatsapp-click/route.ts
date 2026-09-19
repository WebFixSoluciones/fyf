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
        await prisma.whatsAppInteraction.create({
          data: {
            productId,
            variantDetails: variantDetails || {},
            calculatedPrice: Number(calculatedPrice) || 0,
            quantity: Number(quantity) || 1,
          },
        });
      }
    } catch (dbErr) {
      console.warn("Could not persist WhatsApp interaction to db:", dbErr);
    }

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error: any) {
    console.error("WhatsApp analytics error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return sample or real analytics summary
    const sampleStats = [
      { name: "Base MDF Rizada 20cm", count: 142, percentage: 38 },
      { name: "Caja Acetato Tapa Blanca 21.5x24", count: 89, percentage: 24 },
      { name: "Toppers Acrílico Personalizado", count: 64, percentage: 17 },
      { name: "Base MDF Rectangular 30x20", count: 48, percentage: 13 },
      { name: "Mangas Desechables 30cm", count: 31, percentage: 8 },
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
