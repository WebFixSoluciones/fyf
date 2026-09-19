import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FloatingWhatsapp } from "@/components/layout/floating-whatsapp";
import { CookieConsent } from "@/components/common/cookie-consent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fyf.com.ec"),
  title: "FYF Uniformes | Fabricantes de Uniformes Corporativos e Industriales en Ecuador",
  description: "Fabricantes de uniformes corporativos y ropa de trabajo con +20 años de experiencia en Ecuador. Calidad, personalización, ropa ignífuga, ropa térmica, calzado industrial e implementos de seguridad.",
  keywords: [
    "uniformes ecuador",
    "ropa de trabajo quito",
    "uniformes corporativos",
    "ropa ignifuga",
    "ropa termica",
    "calzado industrial",
    "implementos de seguridad",
    "fabricantes de uniformes ecuador",
  ],
  openGraph: {
    title: "FYF Uniformes | Fabricantes de Uniformes Corporativos e Industriales en Ecuador",
    description: "Fabricantes de uniformes corporativos y ropa de trabajo con +20 años de experiencia. Calidad, personalización y entrega puntual.",
    url: "https://www.fyf.com.ec",
    siteName: "FYF UNIFORMES",
    locale: "es_EC",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen flex flex-col">
        <CartProvider>
          {children}
          <CartDrawer />
          <FloatingWhatsapp />
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
}

