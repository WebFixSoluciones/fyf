'use client';

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle2, AlertCircle, PackageCheck, BookmarkCheck, FileText } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess("¡Bienvenido! Ingresando a tu cuenta...");
        setTimeout(() => {
          onClose();
          router.push("/cuenta/pedidos");
          router.refresh();
        }, 800);
      } else {
        setError(data.message || "Credenciales incorrectas.");
      }
    } catch {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess("¡Cuenta creada exitosamente! Iniciando sesión...");
        setTimeout(() => {
          onClose();
          router.push("/cuenta/pedidos");
          router.refresh();
        }, 900);
      } else {
        setError(data.message || "Error al crear la cuenta.");
      }
    } catch {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors z-20"
          aria-label="Cerrar modal"
        >
          <X className="size-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 min-h-[420px]">
          {/* Left Panel: Value proposition (Desktop) */}
          <div className="hidden md:flex md:col-span-2 bg-black text-white p-6 sm:p-8 flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="relative size-10 rounded-full overflow-hidden border border-neutral-700 bg-white shrink-0">
                  <Image src="/logo.jpg" alt="FYF Uniformes" fill className="object-cover" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-white leading-tight uppercase tracking-wider">
                    FYF Uniformes
                  </span>
                  <span className="block text-[10px] text-[#FF841D] uppercase tracking-widest font-medium">
                    Portal Clientes
                  </span>
                </div>
              </div>

              <h3 className="text-base font-medium text-white mb-6 leading-snug">
                Gestiona tus pedidos y cotizaciones en un solo lugar
              </h3>

              <div className="space-y-4 text-xs text-neutral-300">
                <div className="flex items-start gap-3">
                  <PackageCheck className="size-4 text-[#FF841D] shrink-0 mt-0.5" />
                  <span>Seguimiento en tiempo real de órdenes de uniformes</span>
                </div>
                <div className="flex items-start gap-3">
                  <BookmarkCheck className="size-4 text-[#FF841D] shrink-0 mt-0.5" />
                  <span>Guarda productos para cotizaciones corporativas rápidas</span>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="size-4 text-[#FF841D] shrink-0 mt-0.5" />
                  <span>Descarga de comprobantes y órdenes de confección</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-neutral-800 text-[11px] text-neutral-400">
              ¿Dudas con tu compra? Contáctanos directamente al WhatsApp comercial.
            </div>
          </div>

          {/* Right Panel: Auth Form */}
          <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-center bg-white">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-medium text-black tracking-tight">
                {tab === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {tab === "login"
                  ? "Ingresa tu correo y contraseña para acceder"
                  : "Regístrate para guardar cotizaciones y realizar pedidos"}
              </p>
            </div>

            {/* Error / Success Notifications */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="size-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="nombre@empresa.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF841D] focus:ring-1 focus:ring-[#FF841D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => setError("Por favor contacta a ventas@fyf.com.ec para restablecer tu acceso.")}
                      className="text-[11px] text-slate-500 hover:text-[#FF841D] hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF841D] focus:ring-1 focus:ring-[#FF841D] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* High Contrast Orange Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF841D] hover:bg-[#e57212] text-white font-medium text-xs sm:text-sm py-3 rounded-lg shadow-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60"
                >
                  {loading ? "Verificando..." : "Iniciar sesión"}
                </button>

                {/* Divider to switch to Register */}
                <div className="pt-3 border-t border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block mb-2">¿Eres nuevo cliente?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTab("register");
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-medium text-xs sm:text-sm py-2.5 rounded-lg transition-colors"
                  >
                    Crear cuenta
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nombre o Razón Social
                  </label>
                  <div className="relative">
                    <User className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Empresa o Nombre Completo"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF841D] focus:ring-1 focus:ring-[#FF841D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="contacto@empresa.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF841D] focus:ring-1 focus:ring-[#FF841D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="0991234567"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF841D] focus:ring-1 focus:ring-[#FF841D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 text-xs text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF841D] focus:ring-1 focus:ring-[#FF841D] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* High Contrast Orange Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF841D] hover:bg-[#e57212] text-white font-medium text-xs sm:text-sm py-2.5 rounded-lg shadow-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60 mt-1"
                >
                  {loading ? "Creando cuenta..." : "Registrarme"}
                </button>

                <div className="pt-2 text-center">
                  <span className="text-xs text-slate-500">¿Ya tienes cuenta? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTab("login");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-xs font-medium text-[#FF841D] hover:underline"
                  >
                    Iniciar sesión
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
