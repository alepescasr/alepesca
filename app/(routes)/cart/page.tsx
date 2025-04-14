"use client";

import { useEffect, useState } from "react";

import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import FormClientInfo, { FormValues } from "./components/form-client-info";

import Summary from "./components/summary";
import CartItem from "./components/cart-item";
import ShippingPayment from "@/components/shipping-payment";

/* export const revalidate = 0; */

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [totalAmount, setTotalAmount] = useState(0);
  const [clientInfo, setClientInfo] = useState<FormValues | null>(null);
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Verificar si hay algún item con formato incorrecto y limpiarlo
  useEffect(() => {
    if (isMounted) {
      // Buscar elementos que no cumplan con la estructura esperada
      const hasInvalidItems = cart.items.some(
        (item) => !item.product || !item.product.id
      );

      // Si hay elementos inválidos, limpiar el carrito
      if (hasInvalidItems) {
        console.warn(
          "Se encontraron items con formato incorrecto. Limpiando carrito..."
        );
        cart.removeAll();
        // Forzar una recarga para asegurar que todo esté limpio
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart-storage");
          window.location.reload();
        }
      }
    }
  }, [cart, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (  
    <div className="bg-primary-lighter/30">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Carrito de Compras</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 ? (
                <p className="text-neutral-500">
                  No hay productos en el carrito.
                </p>
              ) : (
                <>
                  <ul className="divide-y divide-gray-200">
                    {cart.items.map((item) =>
                      item.product && item.product.id ? (
                        <CartItem key={item.product.id} data={item} />
                      ) : null
                    )}
                  </ul>
                  
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Información de envío
                    </h2>
                    <FormClientInfo onFormDataChange={setClientInfo} />
                  </div>

                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Opciones de envío y pago
                    </h2>
                    <ShippingPayment 
                      onShippingChange={setShippingCost}
                      onPaymentMethodChange={setPaymentMethod}
                      totalAmount={totalAmount}
                      clientInfo={clientInfo}
                    />
                  </div>
                </>
              )}
            </div>
            <Summary 
              shippingCost={shippingCost}
              paymentMethod={paymentMethod}
              onTotalChange={setTotalAmount}
              clientInfo={clientInfo}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
