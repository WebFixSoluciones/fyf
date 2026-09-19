import bcrypt from "bcryptjs";

export type UserRole = "ADMIN" | "COLABORADOR";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Usuarios iniciales predeterminados
const INITIAL_USERS: AdminUser[] = [
  {
    id: "usr_admin_01",
    name: "Administrador FYF",
    email: "admin@fyf.com.ec",
    username: "admin",
    passwordHash: bcrypt.hashSync("FyfAdmin2026*", 10),
    role: "ADMIN",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "usr_colab_01",
    name: "Colaborador FYF",
    email: "ventas@fyf.com.ec",
    username: "colaborador",
    passwordHash: bcrypt.hashSync("FyfColab2026*", 10),
    role: "COLABORADOR",
    isActive: true,
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

// In-memory store persistente para tiempo de ejecución
let usersStore: AdminUser[] = [...INITIAL_USERS];

export function getAllUsers(): Omit<AdminUser, "passwordHash">[] {
  return usersStore.map(({ passwordHash, ...user }) => user);
}

export function findUserById(id: string): AdminUser | undefined {
  return usersStore.find((u) => u.id === id);
}

export function findUserByIdentifier(identifier: string): AdminUser | undefined {
  const clean = identifier.trim().toLowerCase();
  return usersStore.find(
    (u) => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
  );
}

export function verifyPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (err) {
    return false;
  }
}

export function createUser(data: {
  name: string;
  email: string;
  username?: string;
  password: string;
  role: UserRole;
}): { success: boolean; user?: Omit<AdminUser, "passwordHash">; message?: string } {
  const existing = findUserByIdentifier(data.email);
  if (existing) {
    return { success: false, message: "Ya existe un usuario con este correo electrónico." };
  }

  const username = data.username?.trim().toLowerCase() || data.email.split("@")[0].toLowerCase();
  const existingUsername = usersStore.find((u) => u.username.toLowerCase() === username);
  if (existingUsername) {
    return { success: false, message: "El nombre de usuario ya está en uso." };
  }

  const newUser: AdminUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    username,
    passwordHash: bcrypt.hashSync(data.password, 10),
    role: data.role,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  usersStore.push(newUser);

  const { passwordHash, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}

export function updateUser(
  id: string,
  updates: {
    name?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
    password?: string;
  }
): { success: boolean; user?: Omit<AdminUser, "passwordHash">; message?: string } {
  const index = usersStore.findIndex((u) => u.id === id);
  if (index === -1) {
    return { success: false, message: "Usuario no encontrado." };
  }

  const current = usersStore[index];

  // No permitir degradar al admin principal raíz
  if (current.id === "usr_admin_01" && updates.role === "COLABORADOR") {
    return { success: false, message: "No se puede degradar al administrador raíz del sistema." };
  }

  if (updates.email && updates.email !== current.email) {
    const emailTaken = usersStore.some(
      (u) => u.id !== id && u.email.toLowerCase() === updates.email!.toLowerCase()
    );
    if (emailTaken) {
      return { success: false, message: "El correo electrónico ya está registrado por otro usuario." };
    }
  }

  const updatedUser: AdminUser = {
    ...current,
    name: updates.name !== undefined ? updates.name.trim() : current.name,
    email: updates.email !== undefined ? updates.email.trim().toLowerCase() : current.email,
    role: updates.role !== undefined ? updates.role : current.role,
    isActive: updates.isActive !== undefined ? updates.isActive : current.isActive,
    passwordHash: updates.password ? bcrypt.hashSync(updates.password, 10) : current.passwordHash,
  };

  usersStore[index] = updatedUser;

  const { passwordHash, ...safeUser } = updatedUser;
  return { success: true, user: safeUser };
}

export function deleteUser(id: string): { success: boolean; message?: string } {
  if (id === "usr_admin_01") {
    return { success: false, message: "No se puede eliminar el usuario administrador principal." };
  }

  const initialLength = usersStore.length;
  usersStore = usersStore.filter((u) => u.id !== id);

  if (usersStore.length === initialLength) {
    return { success: false, message: "Usuario no encontrado." };
  }

  return { success: true };
}

export function recordLogin(id: string) {
  const user = usersStore.find((u) => u.id === id);
  if (user) {
    user.lastLogin = new Date().toISOString();
  }
}
