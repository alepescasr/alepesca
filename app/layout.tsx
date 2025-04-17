import { Urbanist } from "next/font/google";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import CartInitializer from "@/components/cart-initializer";

import "./globals.css";

const font = Urbanist({ subsets: ["latin"] });

export const metadata = {
  // Metadatos básicos SEO
  title: "AlePesca | Tienda especializada en artículos de pesca deportiva",
  description: "Encuentra los mejores artículos para pesca deportiva en AlePesca. Amplio catálogo de cañas, carretes, señuelos y accesorios de las mejores marcas del mercado.",
  keywords: "pesca deportiva, cañas de pescar, carretes, señuelos, accesorios de pesca",
  
  // Favicon y otros iconos
  icons: {
    icon: "/favicon.ico",
 /*    apple: "/apple-icon.png",
    shortcut: "/shortcut-icon.png", */
  },
  
  // Configuración de robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  
  // Configuración para redes sociales - Open Graph
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://alepesca.com/",
    siteName: "AlePesca",
    title: "AlePesca | Tu tienda de pesca deportiva online",
    description: "Los mejores productos para pesca deportiva. Envíos a todo el país.",
    images: [
      {
        url: "https://alepesca.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AlePesca - Tienda de pesca deportiva",
      },
    ],
  },
  
  // Configuración para Twitter
 /*  twitter: {
    card: "summary_large_image",
    title: "AlePesca | Tienda de artículos para pesca deportiva",
    description: "Artículos de primera calidad para pesca deportiva. Envíos a todo el país.",
    images: ["https://alepesca.com/twitter-image.jpg"],
    creator: "@alepesca",
  }, */
  
  // Configuración de idioma
  alternates: {
    canonical: "https://alepesca.com",
    languages: {
      'es-ES': "https://alepesca.com",
    },
  },
  
  // Configuración del viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={font.className + " bg-primary-lighter/30"}>
        <ToastProvider />
        <ModalProvider />
        <CartInitializer />
        <Navbar />
        {children}
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}