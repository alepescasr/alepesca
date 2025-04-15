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
  title: "AlePesca",
  description:
    "AlePesca - Tu tienda especializada en artículos de pesca deportiva con los mejores productos y marcas del mercado.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
