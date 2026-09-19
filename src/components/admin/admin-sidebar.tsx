'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  TrendingUp,
  Settings,
  LogOut,
  Shield,
  Users,
  Megaphone,
  ExternalLink,
  UserCheck
} from "lucide-react";
import { SessionUser } from "@/lib/auth";

interface AdminSidebarProps {
  session?: SessionUser | null;
}

export function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();

  // No renderizar barra lateral en la página de login
  if (pathname === "/admin/login") {
    return null;
  }

  const role = session?.role || "ADMIN";
  const isAdmin = role === "ADMIN";

  // Ítems base para todos los roles (Admin y Colaboradores)
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Pedidos y Envíos", href: "/admin/pedidos", icon: ShoppingBag },
    { label: "Productos de la Tienda", href: "/admin/productos", icon: Package },
    { label: "Publicidad & Banners", href: "/admin/publicidad", icon: Megaphone },
    { label: "Analítica WhatsApp", href: "/admin/analitica", icon: TrendingUp },
  ];

  // Ítems exclusivos para el Administrador Principal
  const adminOnlyItems = [
    { label: "Control de Usuarios", href: "/admin/usuarios", icon: Users },
    { label: "Ajustes de Tienda", href: "/admin/ajustes", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center p-1.5 border border-slate-700 shrink-0 text-white font-black text-sm">
            <span className="text-amber-500 font-bold">F</span>&amp;<span className="text-amber-500 font-bold">F</span>
          </div>
          <div className="min-w-0">
            <span className="font-bold text-white text-sm tracking-tight block truncate">
              FYF Uniformes
            </span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Shield className="size-2.5 text-emerald-400 shrink-0" />
              <span>Panel de Control</span>
            </span>
          </div>
        </div>

        {/* User Identity Pill */}
        {session && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
            <div className="size-7 rounded-lg bg-alina-600/20 text-alina-400 flex items-center justify-center font-bold text-xs shrink-0">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{session.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                    isAdmin
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  }`}
                >
                  {isAdmin ? "Administrador" : "Colaborador"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
          Operaciones de Tienda
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-alina-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Sección Exclusiva Administrador */}
        {isAdmin && (
          <>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-4 pb-1">
              Administración Central
            </div>
            {adminOnlyItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-alina-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Bottom Store link & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span>Ver Tienda en Vivo</span>
          <ExternalLink className="size-3.5" />
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
