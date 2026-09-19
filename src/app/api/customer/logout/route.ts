import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/lib/customer-auth";

export async function POST() {
  try {
    await clearCustomerSession();
    return NextResponse.json({ success: true, message: "Sesión cerrada correctamente." });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Error al cerrar sesión." },
      { status: 500 }
    );
  }
}
