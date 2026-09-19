'use client';

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-slate-200">
        <div className="text-center mb-6">
          <Image
            src="/logo.jpg"
            alt="Alina Shop"
            width={140}
            height={55}
            className="h-12 sm:h-14 w-auto object-contain mx-auto mb-3"
            priority
          />
          <h1 className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
            Acceso Administrativo
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control de Administrador y Colaboradores de Tienda
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 mb-4 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Usuario o Correo Electrónico
            </label>
            <div className="relative">
              <User className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@alinashop.ec"
                className="w-full border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-alina-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-alina-600 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Verificando acceso..." : "Iniciar Sesión"}</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

        {/* Cuentas de Acceso Rápido / Demo */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
            Cuentas del Sistema
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo("admin@alinashop.ec", "AlinaAdmin2026*")}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-alina-50 hover:border-alina-300 text-left transition-all cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>Administrador</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">Control Total</div>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("colaborador@alinashop.ec", "Colaborador2026*")}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-alina-50 hover:border-alina-300 text-left transition-all cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <Sparkles className="size-3.5 text-alina-600" />
                <span>Colaborador</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">Solo Tienda</div>
            </button>
          </div>
        </div>

        <div className="mt-5 text-center text-[11px] text-slate-400">
          Alina Shop Ecuador · Panel Protegido con Encriptación Segura
        </div>
      </div>
    </div>
  );
}
