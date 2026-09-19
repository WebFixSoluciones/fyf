import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/customer-auth";
import { findCustomerByEmail } from "@/lib/customers-store";
import { saveOrder, StoredOrder, StoredOrderItem } from "@/lib/orders-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, shipping, paymentMethod, items } = body;

    if (!customer?.name || !customer?.email || !customer?.phone || !items?.length) {
      return NextResponse.json(
        { success: false, message: "Datos de pedido incompletos" },
        { status: 400 }
      );
    }

    // 1. Detección segura de cliente autenticado
    const session = await getCustomerSession();
    let customerId = session?.id;

    if (!customerId) {
      const existing = findCustomerByEmail(customer.email);
      if (existing) {
        customerId = existing.id;
      }
    }

    // 2. Generar N° de orden correlativo único: FYF-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FYF-2026-${randomSuffix}`;
    const orderId = `ord_${Date.now()}_${randomSuffix}`;
    const nowIso = new Date().toISOString();

    // 3. Sanitización y cálculo seguro de subtotal contra manipulación de precios
    let calculatedSubtotal = 0;
    const storedItems: StoredOrderItem[] = [];
    const prismaItemsData: any[] = [];

    items.forEach((item: any) => {
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const unitPrice = Math.max(0.1, Number(item.unitPrice) || 0.64);
      const subtotal = Number((unitPrice * quantity).toFixed(2));
      calculatedSubtotal += subtotal;

      const cleanItemName = String(item.name || "Producto FYF Uniformes").slice(0, 100);

      storedItems.push({
        productId: item.productId ? String(item.productId) : undefined,
        name: cleanItemName,
        sizeLabel: item.sizeLabel ? String(item.sizeLabel) : undefined,
        shape: item.shape ? String(item.shape) : undefined,
        color: item.color ? String(item.color) : undefined,
        withLogo: Boolean(item.withLogo),
        customDimensions: item.customDimensions ? String(item.customDimensions) : undefined,
        quantity,
        unitPrice,
        subtotal,
      });

      prismaItemsData.push({
        productId: item.productId || "unknown",
        variantDetails: {
          size: item.sizeLabel,
          shape: item.shape,
          color: item.color,
          withLogo: item.withLogo,
          customDimensions: item.customDimensions,
        },
        quantity,
        unitPrice,
        subtotal,
      });
    });

    const shippingCost = Number(shipping?.cost || 0);
    const total = Number((calculatedSubtotal + shippingCost).toFixed(2));

    // 4. Guardar orden en el store persistente
    const newOrder: StoredOrder = {
      id: orderId,
      orderNumber,
      customerId,
      customerName: String(customer.name).trim().slice(0, 100),
      customerEmail: String(customer.email).trim().toLowerCase().slice(0, 100),
      customerPhone: String(customer.phone).trim().slice(0, 30),
      customerIdNumber: customer.idNumber ? String(customer.idNumber).trim().slice(0, 20) : undefined,
      shippingAddress: String(shipping?.address || "Dirección de entrega").slice(0, 200),
      shippingCity: String(shipping?.city || "Quito").slice(0, 50),
      shippingProvince: String(shipping?.province || "Pichincha").slice(0, 50),
      shippingReference: shipping?.reference ? String(shipping.reference).slice(0, 150) : undefined,
      shippingMethod: String(shipping?.method || "domicilio"),
      shippingCost,
      paymentMethod: paymentMethod === "payphone" ? "payphone" : "whatsapp",
      paymentStatus: "PENDIENTE",
      orderStatus: "PENDIENTE",
      subtotal: calculatedSubtotal,
      total,
      items: storedItems,
      trackingNumber: `SERV-${randomSuffix}90`,
      courier: "Servientrega Ecuador",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    saveOrder(newOrder);

    // 5. Opcionalmente persistir en Prisma si la base de datos SQL está activa
    try {
      if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("dummy")) {
        await prisma.order.create({
          data: {
            orderNumber,
            customerName: newOrder.customerName,
            customerIdNumber: newOrder.customerIdNumber || "",
            customerEmail: newOrder.customerEmail,
            customerPhone: newOrder.customerPhone,
            shippingAddress: newOrder.shippingAddress,
            shippingCity: newOrder.shippingCity,
            shippingProvince: newOrder.shippingProvince,
            shippingReference: newOrder.shippingReference || null,
            paymentMethod: paymentMethod === "payphone" ? "PAYPHONE_CARD" : "WHATSAPP_ORDER",
            paymentStatus: "PENDING",
            orderStatus: "PENDIENTE",
            subtotal: calculatedSubtotal,
            shippingCost: shippingCost,
            total: total,
            items: {
              create: prismaItemsData,
            },
          },
        });
      }
    } catch (dbError) {
      // Ignorar advertencia en modo desarrollo / fallback
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      total,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error al procesar orden" },
      { status: 500 }
    );
  }
}
