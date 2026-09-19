import { NextResponse } from "next/server";
import { createCustomer } from "@/lib/customers-store";
import { setCustomerSession } from "@/lib/customer-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, idNumber } = body;

    // 1. Validaciones de entrada estrictas
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Ingresa tu nombre o el de tu pastelería (mínimo 2 caracteres)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Ingresa un correo electrónico válido." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
      return NextResponse.json(
        { success: false, message: "Ingresa un número telefónico o WhatsApp de contacto válido." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, message: "La contraseña debe contener al menos 6 caracteres por seguridad." },
        { status: 400 }
      );
    }

    // 2. Crear cliente con hash bcrypt
    const newCustomer = await createCustomer({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      idNumber: idNumber ? String(idNumber).trim() : undefined,
    });

    // 3. Emitir cookie de sesión segura HttpOnly
    await setCustomerSession(newCustomer);

    return NextResponse.json({
      success: true,
      message: "¡Cuenta creada exitosamente! Bienvenido a Alina Shop.",
      customer: newCustomer,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Error al procesar el registro." },
      { status: 400 }
    );
  }
}
