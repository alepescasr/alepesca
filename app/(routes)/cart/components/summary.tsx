"use client";

import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Pago completado.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Algo salió mal.");
    }
  }, [searchParams, removeAll]);

  // Calcular subtotal considerando cantidades y precios con oferta
  const subtotal = items.reduce((total, item) => {
    const itemPrice =
      item.product.hasOffer && item.product.offerPrice
        ? Number(item.product.offerPrice)
        : Number(item.product.price);

    return total + itemPrice * item.quantity;
  }, 0);

  const onCheckout = async () => {
    try {
      // Preparar los datos para la solicitud de pago incluyendo items completos y cantidades
      const cartItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      // Preparar un objeto simple para los datos del formulario (si se implementa después)
      const orderFormData = {
        // Aquí se pueden añadir campos de formulario si se implementan después
      };

      // Mostrar carga
      toast.loading("Procesando tu pago...");

      // Enviar cartItems completos
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

  // Contar el número total de productos (suma de cantidades)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">
        Detalles de la orden
      </h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Subtotal ({itemCount} {itemCount === 1 ? "producto" : "productos"})
          </div>
          <Currency value={subtotal} />
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Total</div>
          <Currency value={subtotal} />
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Pagar
      </Button>
    </div>
  );
};
export default Summary;
