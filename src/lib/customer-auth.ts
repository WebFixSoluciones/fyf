import { cookies } from "next/headers";
import { CustomerUser, findCustomerById } from "./customers-store";

export const CUSTOMER_COOKIE_NAME = "alina_customer_session";

export interface CustomerSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber?: string;
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(CUSTOMER_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const jsonStr = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const data = JSON.parse(jsonStr);

    if (!data.id || !data.email) {
      return null;
    }

    // Verificar expiración (30 días)
    if (data.exp && Date.now() > data.exp) {
      return null;
    }

    // Verificar si el cliente existe en el store
    const customer = findCustomerById(data.id);
    if (!customer) {
      // Si el servidor reinició pero el token es válido dentro del período
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        idNumber: data.idNumber,
      };
    }

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      idNumber: customer.idNumber,
    };
  } catch (e) {
    return null;
  }
}

export async function isAuthenticatedCustomer(): Promise<boolean> {
  const session = await getCustomerSession();
  return session !== null;
}

export async function setCustomerSession(customer: {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber?: string;
}): Promise<void> {
  const cookieStore = await cookies();
  const payload = {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    idNumber: customer.idNumber,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 días
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64");

  cookieStore.set(CUSTOMER_COOKIE_NAME, encoded, {
    httpOnly: true, // Inaccesible por JavaScript en el cliente para prevenir robo de sesión por XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Protección contra ataques CSRF
    maxAge: 60 * 60 * 24 * 30, // 30 días
    path: "/",
  });
}

export async function clearCustomerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE_NAME);
}
