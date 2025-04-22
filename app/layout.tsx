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
  title: "AlePescaSR | La mejor tienda online de artículos de pesca deportiva",
  description: "AlePescaSR es tu tienda especializada en pesca deportiva con el mejor catálogo de cañas, carretes, señuelos y accesorios de las mejores marcas. Envíos a todo el país.",
  keywords: "alepescasr, pesca deportiva, tienda de pesca, cañas de pescar, carretes, señuelos, accesorios de pesca",
  priority: 1.0,
  links: [
    {
      rel: "Home",
      href: "https://alepescasr.com",
    },
  ],
  // Favicon y otros iconos
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
    shortcut: "/favicon.ico", 
  },
  
  // Configuración de robots
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  
  // Configuración para redes sociales - Open Graph
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://alepescasr.com/",
    siteName: "AlePesca",
    title: "AlePesca | Tu tienda de pesca deportiva online",
    description: "Los mejores productos para pesca deportiva. Envíos a todo el país.",
    images: [
      {
        url: "https://alepescasr.com/_next/image?url=%2Flogo-1.png&w=1920&q=75",
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
    canonical: "https://alepescasr.com",
    languages: {
      'es-ES': "https://alepescasr.com",
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