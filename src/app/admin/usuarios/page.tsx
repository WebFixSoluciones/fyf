'use client';

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  Lock,
  Mail,
  User,
  X,
  KeyRound
} from "lucide-react";
import { AdminUser, UserRole } from "@/lib/users-store";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Omit<AdminUser, "passwordHash">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Omit<AdminUser, "passwordHash"> | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "COLABORADOR" as UserRole,
    isActive: true,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || "Error al cargar usuarios");
      }
    } catch (e) {
      setError("Error de conexión al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      role: "COLABORADOR",
      isActive: true,
    });
    setIsModalOpen(true);
    setError("");
    setSuccess("");
  };

  const openEditModal = (user: Omit<AdminUser, "passwordHash">) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      password: "", // Dejar en blanco si no desea cambiar
      role: user.role,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingUser) {
        // Actualizar usuario existente
        const res = await fetch("/api/admin/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingUser.id,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            isActive: formData.isActive,
            password: formData.password || undefined,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setSuccess("Usuario actualizado correctamente.");
          setIsModalOpen(false);
          fetchUsers();
        } else {
          setError(data.message || "Error al actualizar");
        }
      } else {
        // Crear nuevo usuario
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setSuccess("Colaborador creado exitosamente.");
          setIsModalOpen(false);
          fetchUsers();
        } else {
          setError(data.message || "Error al crear usuario");
        }
      }
    } catch (err) {
      setError("Error de comunicación con el servidor");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el acceso de "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Usuario "${name}" eliminado.`);
        fetchUsers();
      } else {
        setError(data.message || "No se pudo eliminar el usuario.");
      }
    } catch (e) {
      setError("Error al eliminar el usuario.");
    }
  };

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const colabCount = users.filter((u) => u.role === "COLABORADOR").length;

  return (
    <main className="p-6 sm:p-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="size-6 text-alina-600" />
            <span>Control de Usuarios y Colaboradores</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Asigna colaboradores de tienda limitados a gestión operativa sin acceso administrativo
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
        >
          <UserPlus className="size-4" />
          <span>Crear Nuevo Colaborador</span>
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="size-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Cuentas
          </span>
          <div className="font-display font-bold text-2xl text-slate-900">{users.length}</div>
          <span className="text-xs text-slate-500">Usuarios registrados</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Administradores
          </span>
          <div className="font-display font-bold text-2xl text-emerald-600">{adminCount}</div>
          <span className="text-xs text-slate-500">Control total del sistema</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Colaboradores de Tienda
          </span>
          <div className="font-display font-bold text-2xl text-purple-600">{colabCount}</div>
          <span className="text-xs text-slate-500">Limitados a pedidos y productos</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-display font-bold text-sm text-slate-900">
            Lista de Accesos Autorizados
          </h2>
          <span className="text-xs text-slate-400">{users.length} cuentas activas</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No hay usuarios registrados.</div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Correo / Identificador</th>
                  <th className="py-3 px-4">Rol Asignado</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => {
                  const isRootAdmin = u.id === "usr_admin_01";
                  const isAdminRole = u.role === "ADMIN";

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{u.name}</div>
                            {isRootAdmin && (
                              <span className="text-[10px] text-amber-600 font-bold">Cuenta Raíz</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-900 text-xs">{u.email}</div>
                        <div className="text-[11px] text-slate-400">@{u.username}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            isAdminRole
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-purple-50 text-purple-800 border-purple-200"
                          }`}
                        >
                          {isAdminRole ? (
                            <ShieldCheck className="size-3 text-emerald-600" />
                          ) : (
                            <Sparkles className="size-3 text-purple-600" />
                          )}
                          <span>{isAdminRole ? "Administrador" : "Colaborador de Tienda"}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            u.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {u.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar usuario"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          {!isRootAdmin && (
                            <button
                              onClick={() => handleDelete(u.id, u.name)}
                              className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Regla de Roles Informativa */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="size-4 text-alina-600" />
          <span>Alcance de Permisos por Rol en Alina Shop</span>
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>
            <strong>Administrador:</strong> Acceso sin restricciones a pedidos, catálogo, reportes de analítica, módulo de publicidad, gestión de usuarios y ajustes globales.
          </li>
          <li>
            <strong>Colaborador de Tienda:</strong> Acceso estrictamente limitado a la preparación de pedidos, consulta de envíos y catálogo de productos. Queda automáticamente bloqueado de Ajustes y Usuarios.
          </li>
        </ul>
      </div>

      {/* Modal Crear / Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-slate-900">
                {editingUser ? "Editar Usuario / Colaborador" : "Nuevo Colaborador de Tienda"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Sofía Herrera"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sofia@pasteleria.com"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nombre de Usuario (Login)</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="sofia (opcional, por defecto el correo)"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {editingUser ? "Nueva Contraseña (dejar en blanco para conservar)" : "Contraseña de Acceso"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-alina-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rol Asignado</label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`p-2.5 rounded-xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                      formData.role === "COLABORADOR"
                        ? "border-purple-600 bg-purple-50/50 ring-1 ring-purple-600 font-bold text-purple-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="COLABORADOR"
                      checked={formData.role === "COLABORADOR"}
                      onChange={() => setFormData({ ...formData, role: "COLABORADOR" })}
                      className="sr-only"
                    />
                    <Sparkles className="size-4 mb-1 text-purple-600" />
                    <span>Colaborador</span>
                    <span className="text-[10px] text-slate-400 font-normal">Solo Operaciones</span>
                  </label>

                  <label
                    className={`p-2.5 rounded-xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                      formData.role === "ADMIN"
                        ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 font-bold text-emerald-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="ADMIN"
                      checked={formData.role === "ADMIN"}
                      onChange={() => setFormData({ ...formData, role: "ADMIN" })}
                      className="sr-only"
                    />
                    <ShieldCheck className="size-4 mb-1 text-emerald-600" />
                    <span>Administrador</span>
                    <span className="text-[10px] text-slate-400 font-normal">Acceso Total</span>
                  </label>
                </div>
              </div>

              {editingUser && (
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="size-4 rounded text-alina-600"
                    />
                    <span className="font-semibold text-slate-800">Cuenta Activa (puede iniciar sesión)</span>
                  </label>
                </div>
              )}

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-md cursor-pointer"
                >
                  {editingUser ? "Guardar Cambios" : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
