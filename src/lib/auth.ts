import { cookies } from "next/headers";
import { AdminUser, UserRole, findUserById } from "./users-store";

export const ADMIN_COOKIE_NAME = "fyf_admin_session";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
}

export async function getAdminSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    // Decodificar token base64
    const jsonStr = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const data = JSON.parse(jsonStr);

    if (!data.id || !data.role) {
      return null;
    }

    // Verificar expiración (7 días)
    if (data.exp && Date.now() > data.exp) {
      return null;
    }

    // Opcionalmente confirmar que el usuario existe y está activo
    const user = findUserById(data.id);
    if (user && !user.isActive) {
      return null;
    }

    return {
      id: data.id,
      name: user?.name || data.name,
      email: user?.email || data.email,
      username: user?.username || data.username,
      role: (user?.role || data.role) as UserRole,
    };
  } catch (e) {
    return null;
  }
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

export async function hasAdminRole(): Promise<boolean> {
  const session = await getAdminSession();
  return session?.role === "ADMIN";
}

export async function setAdminSession(user: Omit<AdminUser, "passwordHash">) {
  const cookieStore = await cookies();
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 días
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64");

  cookieStore.set(ADMIN_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
