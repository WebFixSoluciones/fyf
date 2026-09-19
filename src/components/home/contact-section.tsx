'use client';

import React, { useState } from "react";
import { Star, MapPin, ExternalLink, CheckCircle } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    mensaje: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.telefono) return;

    // Send via WhatsApp
    const text = `*Nuevo Contacto desde Web FYF*\n\n*Nombre:* ${formData.nombre}\n*Teléfono:* ${formData.telefono}\n*Email:* ${formData.email || "No especificado"}\n*Mensaje:* ${formData.mensaje || "Sin mensaje"}`;
    const url = `https://wa.me/593993358701?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="bg-white py-14 sm:py-20 border-t border-slate-100">
      <div className="mx-auto w-[95%] max-w-[1720px] px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading, description & Map Preview */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-950">
              CONTÁCTANOS
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
              Nuestro equipo experto está preparado para atender tus preguntas y brindarte orientación en la compra de tus productos o servicios.
            </p>

            {/* Google Map Card Preview matching Image 5 */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-50">
              {/* Map header info */}
              <div className="p-4 bg-white border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-red-600 shrink-0" />
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      F&F ROPA DE TRABAJO
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    FRENTE CANCHA ECUAVOLEY, PARQUE URB. MATOVELLE, N51 y Juan Alzuro E10-40 Y, 170502 Quito
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-700">
                    <span className="font-bold">4,8</span>
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="size-3 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-slate-400">(12 reseñas)</span>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/4tYQ4MMELTFtF8QE9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Abrir en Google Maps"
                >
                  <ExternalLink className="size-4" />
                </a>
              </div>

              {/* Map embed */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-100">
                <iframe
                  title="Ubicación de F&F Ropa de Trabajo en Quito"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.816405205562!2d-78.4735951!3d-0.138865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d591834e5659ab%3A0x676b7e0d37803d15!2sF%26F%20ROPA%20DE%20TRABAJO!5e0!3m2!1ses!2sec!4v1710800000000!5m2!1ses!2sec"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[20%]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Clean Contact Form matching Image 5 */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="size-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                  Gracias por contactarnos. Un asesor de F&F Uniformes se comunicará contigo a la brevedad.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs font-bold text-slate-900 underline hover:text-slate-600"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-nombre" className="block text-sm font-semibold text-slate-900 mb-1.5">
                    Nombre y Apellido
                  </label>
                  <input
                    id="contact-nombre"
                    type="text"
                    required
                    placeholder="Nombre y Apellido"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full rounded-none border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-telefono" className="block text-sm font-semibold text-slate-900 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    id="contact-telefono"
                    type="tel"
                    required
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full rounded-none border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-900 mb-1.5">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-none border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-mensaje" className="block text-sm font-semibold text-slate-900 mb-1.5">
                    Mensaje
                  </label>
                  <textarea
                    id="contact-mensaje"
                    rows={4}
                    placeholder="Mensaje"
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full rounded-none border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-black focus:outline-none focus:ring-0 transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-slate-900 text-white font-bold text-sm tracking-wider uppercase py-4 transition-colors duration-200 mt-2"
                >
                  ENVIAR
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
