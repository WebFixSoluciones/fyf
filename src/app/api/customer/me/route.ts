import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { findOrdersByCustomer } from "@/lib/orders-store";

export async function GET() {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const orders = findOrdersByCustomer(session.email);

    return NextResponse.json({
      success: true,
      authenticated: true,
      customer: session,
      orders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Error al verificar sesión." },
      { status: 500 }
    );
  }
}
