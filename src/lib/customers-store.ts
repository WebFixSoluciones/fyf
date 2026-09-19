import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber?: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

// Cuentas de demostración iniciales
const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: "cust_demo_01",
    name: "Pastelería Sweet Cakes (Karla Morales)",
    email: "cliente@pasteleria.com",
    phone: "0991234567",
    idNumber: "1723456789",
    passwordHash: bcrypt.hashSync("Cliente2026*", 10),
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-01-15T00:00:00.000Z",
  },
];

const DATA_FILE = path.join(process.cwd(), "data", "customers.json");

function loadStoredCustomers(): CustomerUser[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return [...INITIAL_CUSTOMERS];
}

function saveCustomersToFile(customers: CustomerUser[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(customers, null, 2), "utf-8");
  } catch (e) {}
}

let customersStore: CustomerUser[] = loadStoredCustomers();

// Control de intentos de inicio de sesión para protección de fuerza bruta
interface AttemptTracker {
  count: number;
  lockedUntil?: number;
}
const loginAttempts = new Map<string, AttemptTracker>();

export function checkBruteForceLock(identifier: string): { isLocked: boolean; remainingMinutes?: number } {
  const clean = identifier.trim().toLowerCase();
  const record = loginAttempts.get(clean);
  if (!record || !record.lockedUntil) {
    return { isLocked: false };
  }

  const now = Date.now();
  if (now > record.lockedUntil) {
    loginAttempts.delete(clean);
    return { isLocked: false };
  }

  const remainingMinutes = Math.ceil((record.lockedUntil - now) / (60 * 1000));
  return { isLocked: true, remainingMinutes };
}

export function recordFailedLoginAttempt(identifier: string): { isLocked: boolean; remainingMinutes?: number } {
  const clean = identifier.trim().toLowerCase();
  const current = loginAttempts.get(clean) || { count: 0 };
  current.count += 1;

  // Si supera 5 intentos fallidos, bloquear por 15 minutos
  if (current.count >= 5) {
    current.lockedUntil = Date.now() + 15 * 60 * 1000;
    loginAttempts.set(clean, current);
    return { isLocked: true, remainingMinutes: 15 };
  }

  loginAttempts.set(clean, current);
  return { isLocked: false };
}

export function resetFailedLoginAttempts(identifier: string): void {
  const clean = identifier.trim().toLowerCase();
  loginAttempts.delete(clean);
}

export function findCustomerByEmail(email: string): CustomerUser | undefined {
  const clean = email.trim().toLowerCase();
  return customersStore.find((c) => c.email.toLowerCase() === clean);
}

export function findCustomerById(id: string): CustomerUser | undefined {
  return customersStore.find((c) => c.id === id);
}

export function findCustomerByPhone(phone: string): CustomerUser | undefined {
  const clean = phone.replace(/[^0-9]/g, "");
  return customersStore.find((c) => c.phone.replace(/[^0-9]/g, "") === clean);
}

export async function createCustomer(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  idNumber?: string;
}): Promise<Omit<CustomerUser, "passwordHash">> {
  const cleanEmail = data.email.trim().toLowerCase();
  if (findCustomerByEmail(cleanEmail)) {
    throw new Error("Ya existe una cuenta registrada con este correo electrónico.");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const now = new Date().toISOString();
  const newCustomer: CustomerUser = {
    id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    email: cleanEmail,
    phone: data.phone.trim(),
    idNumber: data.idNumber?.trim(),
    passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  customersStore.push(newCustomer);
  saveCustomersToFile(customersStore);

  const { passwordHash: _, ...safeCustomer } = newCustomer;
  return safeCustomer;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyCustomerPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (e) {
    return false;
  }
}

export const verifyPassword = verifyCustomerPassword;

