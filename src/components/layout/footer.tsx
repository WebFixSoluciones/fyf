'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Truck,
  Factory,
  ShieldCheck,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { CATEGORIES_DATA } from "@/lib/catalog-data";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-black text-neutral-400 mt-auto border-t border-neutral-800 font-sans text-xs">
      {/* 1. Value Props / Trust Strip (E-Commerce Pillars) */}
      <div className="border-b border-neutral-800 py-8 bg-[#0a0a0a]">
        <div className="mx-auto w-[95%] max-w-[1720px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-neutral-900 border border-neutral-800 text-[#ff6600] flex items-center justify-center shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-[13px] font-medium tracking-tight">Envíos a Todo el Ecuador</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Servientrega, LaarCourier y carga</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-neutral-900 border border-neutral-800 text-[#ff6600] flex items-center justify-center shrink-0">
              <Factory className="size-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-[13px] font-medium tracking-tight">Fabricantes Directos</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Precios al por mayor y menor</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-neutral-900 border border-neutral-800 text-[#ff6600] flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-[13px] font-medium tracking-tight">Normativas de Seguridad</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Prendas y calzado certificados</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-xl bg-neutral-900 border border-neutral-800 text-[#ff6600] flex items-center justify-center shrink-0">
              <MessageCircle className="size-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-[13px] font-medium tracking-tight">Asesoría Comercial 24/7</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Atención y cotizaciones vía WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Newsletter Strip (Virtual Store Subscription) */}
      <div className="border-b border-neutral-800 py-8 bg-black">
        <div className="mx-auto w-[95%] max-w-[1720px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left">
            <span className="text-[#ff6600] text-[11px] font-medium uppercase tracking-wider block mb-1">
              Boletín Corporativo & Ofertas
            </span>
            <h3 className="text-white text-base sm:text-lg font-medium tracking-tight">
              Recibe catálogos actualizados y promociones de fábrica
            </h3>
            <p className="text-neutral-400 text-xs mt-1">
              Entérate primero de nuevos ingresos en calzado, ropa ignífuga y térmicos.
            </p>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-4 py-3 rounded-xl">
                <CheckCircle2 className="size-4 shrink-0" />
                <span className="text-xs font-medium">¡Gracias por suscribirte a nuestro boletín comercial!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#ff6600] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#ff6600] hover:bg-[#ea580c] text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Suscribirme</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Columns */}
      <div className="py-12 border-b border-neutral-800">
        <div className="mx-auto w-[95%] max-w-[1720px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 leading-relaxed">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative size-11 rounded-full overflow-hidden border border-neutral-700 bg-white shrink-0">
                <Image src="/logo.jpg" alt="FYF Uniformes" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold uppercase tracking-tight text-white leading-none">
                  FYF UNIFORMES
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
                  Ropa de Trabajo & Seguridad
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Empresa líder en diseño, confección y distribución de uniformes corporativos, industriales, ropa térmica para cuartos fríos, overoles ignífugos y calzado de seguridad con más de 20 años de trayectoria en el Ecuador.
            </p>

            <div className="pt-2 text-xs space-y-1 text-neutral-300">
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-[#ff6600] shrink-0" />
                <span>Parque Urb. Matovelle, N51 y Juan Alzuro, Quito</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-[#ff6600] shrink-0" />
                <span>+593 99 335 8701 / 09 8874 2584</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-[#ff6600] shrink-0" />
                <span>ventas@fyf.com.ec</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-[#ff6600] shrink-0" />
                <span>Lun - Vie: 08:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Categorías Principales */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-wider mb-3.5 text-neutral-200">
              Categorías
            </h4>
            <ul className="space-y-2 text-[11px]">
              {CATEGORIES_DATA.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/catalogo?categoria=${cat.slug}`}
                    className="text-neutral-400 hover:text-white transition-colors block uppercase tracking-wider"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atención al Cliente */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-wider mb-3.5 text-neutral-200">
              Atención al Cliente
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/catalogo" className="hover:text-white transition-colors">
                  Cómo Comprar / Cotizar
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:text-white transition-colors">
                  Solicitud de Cotización Empresarial
                </Link>
              </li>
              <li>
                <Link href="/rastreo" className="hover:text-white transition-colors">
                  Rastreo y Estado de Envíos
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:text-white transition-colors">
                  Guía de Tallas y Confección
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:text-white transition-colors">
                  Políticas de Garantía y Devolución
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Tienda y Enlaces */}
          <div>
            <h4 className="text-white font-medium text-xs uppercase tracking-wider mb-3.5 text-neutral-200">
              Tienda Virtual
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/catalogo" className="hover:text-white transition-colors">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Mi Cuenta / Pedidos
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/593993358701?text=Hola%20deseo%20asesoria%20comercial%20para%20uniformes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-[#ff6600]"
                >
                  Asesoría Comercial Directa
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/4tYQ4MMELTFtF8QE9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Ubicación en Google Maps
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="text-neutral-500 hover:text-neutral-300 transition-colors">
                  Acceso Administrativo
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Payment Methods & Copyright Bar */}
      <div className="py-6 bg-[#0a0a0a]">
        <div className="mx-auto w-[95%] max-w-[1720px] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          {/* Payment Methods Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-400 mr-2 flex items-center gap-1">
              <CreditCard className="size-3 text-neutral-400" />
              <span>Medios de Pago:</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 font-medium text-[10px] border border-neutral-800">
              Transferencia Bancaria (Pichincha / Produbanco)
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 font-medium text-[10px] border border-neutral-800">
              Payphone
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 font-medium text-[10px] border border-neutral-800">
              Visa / MasterCard
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 font-medium text-[10px] border border-neutral-800">
              Pago Contra Entrega
            </span>
          </div>

          {/* SSL & Copyright */}
          <div className="flex items-center gap-4 text-neutral-400">
            <div className="flex items-center gap-1 text-emerald-400">
              <Lock className="size-3" />
              <span>Compra Segura SSL 256-bit</span>
            </div>
            <span>·</span>
            <span>© {new Date().getFullYear()} FYF Uniformes. Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
