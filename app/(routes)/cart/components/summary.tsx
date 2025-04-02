"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FormValues } from "./form-client-info";
import Image from "next/image";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

interface SummaryProps {
  shippingCost: number;
  paymentMethod: string;
  onTotalChange: (total: number) => void;
  clientInfo: FormValues | null;
}

const Summary: React.FC<SummaryProps> = ({ 
  shippingCost = 0, 
  paymentMethod,
  onTotalChange,
  clientInfo
}) => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("¡Compra exitosa! Por favor, envía el comprobante por WhatsApp.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Algo salió mal.");
    }
  }, [searchParams, removeAll]);

  // Calcular subtotal considerando cantidades y precios con oferta
  const subtotal = items.reduce((total, item) => {
    if (!item.product) return total;

    const itemPrice =
      item.product.hasOffer && item.product.offerPrice
        ? Number(item.product.offerPrice)
        : Number(item.product.price);

    return total + itemPrice * item.quantity;
  }, 0);

  const finalTotal = subtotal + shippingCost;

  useEffect(() => {
    onTotalChange(finalTotal);
  }, [finalTotal, onTotalChange]);

  const onCheckout = async () => {
    if (!clientInfo) {
      toast.error("Por favor, completa la información de envío antes de proceder con el pago.");
      return;
    }

    try {
      // Verificar si hay items inválidos antes de procesar
      const hasInvalidItems = items.some(
        (item) => !item.product || !item.product.id
      );
      if (hasInvalidItems) {
        toast.error(
          "Hay productos inválidos en el carrito. Por favor, recarga la página."
        );
        return;
      }

      // Preparar los datos para la solicitud de pago
      const cartItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      // Incluir la información del cliente en los datos del pedido
      const orderFormData = {
        shippingCost,
        paymentMethod,
        clientInfo
      };

      // Mostrar carga
      toast.loading("Procesando tu pago...");

      // Enviar datos completos
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          cartItems,
          orderFormData,
        }
      );

      // Redirigir al usuario
      if (response.data && response.data.url) {
        window.location = response.data.url;
      } else {
        throw new Error("No se recibió URL de pago");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error al procesar el pago");
      console.error("Error during checkout:", error);
    }
  };

  const handleMercadoPagoConfirm = () => {
    const orderData = {
      items: items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.hasOffer ? item.product.offerPrice : item.product.price
      })),
      total: finalTotal,
      shippingCost,
      clientInfo,
      paymentMethod: "mercadopago",
      status: "pending",
      createdAt: new Date().toISOString()
    };

    console.log("Datos del pedido:", JSON.stringify(orderData, null, 2));
    toast.success("¡Pedido confirmado! Por favor, envía el comprobante por WhatsApp.");
    removeAll();
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">
        Resumen del pedido
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Subtotal</div>
          <Currency value={subtotal} />
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Envío</div>
          <Currency value={shippingCost} />
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-lg font-semibold text-gray-900">Total</div>
          <Currency value={finalTotal} />
        </div>
      </div>

      {paymentMethod === "mercadopago" && (
        <div className="mt-6 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información de pago con Mercado Pago
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Alias de Mercado Pago:</p>
                <p className="text-lg font-semibold text-gray-900">TIENDA.MP</p>
              </div>
              <div className="relative w-full h-48">
                <Image
                  src="/qr-mercadopago.png"
                  alt="QR de Mercado Pago"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Importante:</span> Después de realizar el pago, 
                  por favor envía el comprobante por WhatsApp al número de la tienda para confirmar tu pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "transfer" && (
        <div className="mt-6 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información de transferencia
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Banco:</p>
                <p className="text-lg font-semibold text-gray-900">Banco Nación</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de cuenta:</p>
                <p className="text-lg font-semibold text-gray-900">Cuenta Corriente</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">CBU:</p>
                <p className="text-lg font-semibold text-gray-900">1234567890123456789012</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Titular:</p>
                <p className="text-lg font-semibold text-gray-900">Nombre del Titular</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Importante:</span> Después de realizar la transferencia, 
                  por favor envía el comprobante por WhatsApp al número de la tienda para confirmar tu pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        {paymentMethod === "mercadopago" ? (
          <Button
            onClick={handleMercadoPagoConfirm}
            disabled={!clientInfo}
            className="w-full"
          >
            Confirmar pago con Mercado Pago
          </Button>
        ) : paymentMethod === "transfer" ? (
          <Button
            onClick={handleMercadoPagoConfirm}
            disabled={!clientInfo}
            className="w-full"
          >
            Confirmar transferencia
          </Button>
        ) : (
          <Button
            onClick={onCheckout}
            disabled={items.length === 0 || !clientInfo}
            className="w-full"
          >
            {!clientInfo 
              ? "Complete la información de envío" 
              : "Continuar con el pago"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Summary;

