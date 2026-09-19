import { NextResponse } from "next/server";
import {
  findCustomerByEmail,
  verifyCustomerPassword,
  checkBruteForceLock,
  recordFailedLoginAttempt,
  resetFailedLoginAttempts,
} from "@/lib/customers-store";
import { setCustomerSession } from "@/lib/customer-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Por favor proporciona correo y contraseña." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Verificar bloqueo por fuerza bruta
    const lockStatus = checkBruteForceLock(cleanEmail);
    if (lockStatus.isLocked) {
      return NextResponse.json(
        {
          success: false,
          message: `Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente por seguridad. Intenta de nuevo en ${lockStatus.remainingMinutes} minutos.`,
        },
        { status: 429 }
      );
    }

    // 2. Buscar cliente
    const customer = findCustomerByEmail(cleanEmail);
    if (!customer) {
      recordFailedLoginAttempt(cleanEmail);
      return NextResponse.json(
        { success: false, message: "Correo o contraseña incorrectos." },
        { status: 401 }
      );
    }

    // 3. Verificar contraseña cifrada con bcrypt
    const isValid = verifyCustomerPassword(password, customer.passwordHash);
    if (!isValid) {
      const attemptResult = recordFailedLoginAttempt(cleanEmail);
      if (attemptResult.isLocked) {
        return NextResponse.json(
          {
            success: false,
            message: `Contraseña incorrecta. Has alcanzado el límite de intentos fallidos. Bloqueado temporalmente por ${attemptResult.remainingMinutes} minutos.`,
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Correo o contraseña incorrectos." },
        { status: 401 }
      );
    }

    // 4. Éxito: limpiar intentos y emitir sesión segura
    resetFailedLoginAttempts(cleanEmail);

    const safeCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      idNumber: customer.idNumber,
    };

    await setCustomerSession(safeCustomer);

    return NextResponse.json({
      success: true,
      message: "¡Bienvenido de nuevo a Alina Shop!",
      customer: safeCustomer,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Error al procesar el inicio de sesión." },
      { status: 500 }
    );
  }
}
