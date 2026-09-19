'use client';

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import { SessionUser } from "@/lib/auth";

interface AdminAuthGuardProps {
  initialSession: SessionUser | null;
  children: React.ReactNode;
}

export function AdminAuthGuard({ initialSession, children }: AdminAuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(initialSession);
  const [loading, setLoading] = useState(!initialSession && pathname !== "/admin/login");

  // Si estamos en la página de login, renderizar directo sin protecciones
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Si no hay sesión inicial, verificar con la API
    if (!session) {
      fetch("/api/admin/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setSession(data.user);
          } else {
            router.replace("/admin/login");
          }
        })
        .catch(() => {
          router.replace("/admin/login");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [pathname, isLoginPage, session, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="w-9 h-9 border-3 border-alina-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-300">
          Verificando credenciales de seguridad de FYF Uniformes...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // RESTRICCIÓN DE SEGURIDAD PARA COLABORADORES:
  // "los colaboradores de tienda estaran limitados a no topar nada administrativo"
  const isRestrictedAdminRoute =
    pathname.startsWith("/admin/usuarios") || pathname.startsWith("/admin/ajustes");

  if (session.role === "COLABORADOR" && isRestrictedAdminRoute) {
    return (
      <div className="flex-1 min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="size-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <ShieldAlert className="size-8" />
          </div>

          <div>
            <h2 className="font-display font-extrabold text-lg text-slate-900">
              Acceso Restringido para Colaboradores
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Tu cuenta está registrada como <strong>Colaborador de Tienda</strong>. Por políticas de seguridad, no tienes permisos para acceder a módulos administrativos sensibles (gestión de usuarios, credenciales y ajustes del sistema).
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-mono text-left">
            <div><strong>Usuario:</strong> {session.name} ({session.email})</div>
            <div><strong>Rol:</strong> {session.role}</div>
            <div><strong>Ruta denegada:</strong> {pathname}</div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Link
              href="/admin/pedidos"
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="size-3.5" />
              <span>Ir a Pedidos</span>
            </Link>
            <Link
              href="/admin/productos"
              className="flex-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ver Productos</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
