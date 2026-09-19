import { NextResponse } from "next/server";
import { hasAdminRole, getAdminSession } from "@/lib/auth";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  findUserById,
} from "@/lib/users-store";

// GET: Listar todos los usuarios y colaboradores (Solo ADMIN)
export async function GET() {
  try {
    const isAdmin = await hasAdminRole();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Acceso denegado. Se requiere rol de Administrador." },
        { status: 403 }
      );
    }

    const users = getAllUsers();
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST: Crear nuevo usuario o colaborador de tienda (Solo ADMIN)
export async function POST(req: Request) {
  try {
    const isAdmin = await hasAdminRole();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Acceso denegado. Se requiere rol de Administrador." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, username, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Nombre, correo y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const assignedRole = role === "ADMIN" ? "ADMIN" : "COLABORADOR";

    const result = createUser({
      name,
      email,
      username,
      password,
      role: assignedRole,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: result.user });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PUT: Modificar usuario o colaborador (Solo ADMIN)
export async function PUT(req: Request) {
  try {
    const isAdmin = await hasAdminRole();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Acceso denegado. Se requiere rol de Administrador." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, name, email, role, isActive, password } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID de usuario requerido." },
        { status: 400 }
      );
    }

    const result = updateUser(id, {
      name,
      email,
      role,
      isActive,
      password,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: result.user });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE: Eliminar usuario o colaborador (Solo ADMIN)
export async function DELETE(req: Request) {
  try {
    const isAdmin = await hasAdminRole();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Acceso denegado. Se requiere rol de Administrador." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID no especificado." }, { status: 400 });
    }

    const session = await getAdminSession();
    if (session?.id === id) {
      return NextResponse.json(
        { success: false, message: "No puedes eliminar tu propia cuenta en sesión activa." },
        { status: 400 }
      );
    }

    const result = deleteUser(id);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
