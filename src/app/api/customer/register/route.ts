import { NextResponse } from "next/server";
import { createCustomer, hashPassword } from "@/lib/customers-store";
import { setCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, idNumber } = body;

    // 1. Validaciones de entrada estrictas
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Ingresa tu nombre o razón social (mínimo 2 caracteres)." },
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

    const cleanEmail = email.trim().toLowerCase();
    let registeredCustomer: {
      id: string;
      name: string;
      email: string;
      phone: string;
      idNumber?: string;
    };

    try {
      const existingDbUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingDbUser) {
        return NextResponse.json(
          { success: false, message: "Ya existe una cuenta registrada con este correo electrónico." },
          { status: 400 }
        );
      }

      const passwordHash = await hashPassword(password);
      const dbUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          phone: phone.trim(),
          idNumber: idNumber ? String(idNumber).trim() : null,
          passwordHash,
          role: "CLIENTE",
          isActive: true,
        },
      });

      registeredCustomer = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || phone.trim(),
        idNumber: dbUser.idNumber || undefined,
      };
    } catch {
      // Fallback local si MySQL no está accesible en desarrollo
      const localCustomer = await createCustomer({
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        password,
        idNumber: idNumber ? String(idNumber).trim() : undefined,
      });
      registeredCustomer = {
        id: localCustomer.id,
        name: localCustomer.name,
        email: localCustomer.email,
        phone: localCustomer.phone,
        idNumber: localCustomer.idNumber,
      };
    }

    // 3. Emitir cookie de sesión segura HttpOnly
    await setCustomerSession(registeredCustomer);

    return NextResponse.json({
      success: true,
      message: "¡Cuenta creada exitosamente! Bienvenido a FYF Uniformes.",
      customer: registeredCustomer,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Error al procesar el registro." },
      { status: 400 }
    );
  }
}
