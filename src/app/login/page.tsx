'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess("¡Credenciales verificadas! Ingresando a tu cuenta...");
        setTimeout(() => {
          router.push("/cuenta/pedidos");
          router.refresh();
        }, 800);
      } else {
        setError(data.message || "Error al iniciar sesión.");
      }
    } catch (err) {
      setError("Error de comunicación con el servidor. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("cliente@pasteleria.com");
    setPassword("Cliente2026*");
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center">
            <div className="size-12 rounded-2xl bg-alina-50 text-alina-600 flex items-center justify-center mx-auto mb-3 border border-alina-100">
              <ShieldCheck className="size-6" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
              Portal de Clientes
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Accede para ver tus pedidos, rastrear envíos y descargar comprobantes oficiales
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="size-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pasteleria@ejemplo.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-alina-600 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Contraseña</label>
                <span className="text-[11px] text-slate-400">Protección cifrada</span>
              </div>
              <div className="relative">
                <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-alina-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-98"
            >
              <span>{loading ? "Verificando..." : "Ingresar a mi Cuenta"}</span>
              <ArrowRight className="size-4" />
            </button>
          </form>

          {/* Demo Login Quick Fill */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-600 text-[11px]">¿Deseas probar una cuenta de muestra?</span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="font-bold text-alina-600 hover:text-alina-700 text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="size-3" />
              <span>Llenar Demo</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/registro" className="font-bold text-alina-600 hover:underline">
              Crea tu cuenta aquí
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
