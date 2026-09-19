import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Factory, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { CATEGORIES_DATA } from "@/lib/catalog-data";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto border-t border-slate-900">
      {/* Value props strip */}
      <div className="border-b border-slate-900 py-8">
        <div className="mx-auto w-[92%] max-w-[1440px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Envíos a Nivel Nacional</h4>
              <p className="text-xs text-slate-400">Cobertura en todo el Ecuador</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Fabricantes Directos</h4>
              <p className="text-xs text-slate-400">+20 años de experiencia</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Normativas de Seguridad</h4>
              <p className="text-xs text-slate-400">Prendas y calzado certificados</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Cotizaciones por WhatsApp</h4>
              <p className="text-xs text-slate-400">Atención inmediata a empresas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer info */}
      <div className="mx-auto w-[92%] max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 text-xs leading-relaxed">
        {/* Brand overview */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-black text-sm">
              <span className="text-amber-500">F</span>
              <span className="text-white font-light text-[10px]">&</span>
              <span className="text-amber-500">F</span>
            </div>
            <span className="text-base font-extrabold uppercase tracking-wider text-white">
              FYF UNIFORMES
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed">
            Fabricantes de uniformes corporativos y ropa de trabajo en Ecuador. Soluciones a la medida, ropa jean, ignífuga, cuartos fríos y calzado de seguridad.
          </p>

          <p className="text-slate-400">
            Hecho en Ecuador con altos estándares de calidad y durabilidad.
          </p>
        </div>

        {/* Categories column */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3.5">
            Líneas de Trabajo
          </h4>
          <ul className="space-y-2">
            {CATEGORIES_DATA.slice(0, 6).map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/catalogo?categoria=${cat.slug}`}
                  className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3.5">
            Enlaces Rápidos
          </h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/catalogo" className="hover:text-white transition-colors">
                Catálogo de Productos
              </Link>
            </li>
            <li>
              <Link href="/#contacto" className="hover:text-white transition-colors">
                Contáctanos y Cotizaciones
              </Link>
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
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3.5">
            Contacto Directo
          </h4>
          <ul className="space-y-2.5 text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="size-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Frente Cancha Ecuavoley, Parque Urb. Matovelle, N51 y Juan Alzuro E10-40 Y, Quito, Ecuador
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-amber-500 shrink-0" />
              <span>09 9335 8701 / 09 8874 2584</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-amber-500 shrink-0" />
              <span>ventas@fyf.com.ec</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        <div className="mx-auto w-[92%] max-w-[1440px] px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} FYF UNIFORMES - F&F Ropa de Trabajo. Todos los derechos reservados.</p>
          <p className="text-slate-400">Fabricación Ecuatoriana de Alto Rendimiento</p>
        </div>
      </div>
    </footer>
  );
}
