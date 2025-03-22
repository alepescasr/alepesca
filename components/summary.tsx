'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Currency from '@/components/ui/currency';
import Button from '@/components/ui/button';
import useCart from '@/hooks/use-cart';
import ShippingPayment from '@/components/shipping-payment';

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    if (searchParams.get('success')) {
      removeAll();
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    const itemPrice = item.product.hasOffer && item.product.offerPrice
      ? Number(item.product.offerPrice)
      : Number(item.product.price);
    return total + (itemPrice * item.quantity);
  }, 0);

  const finalTotal = totalPrice + shippingCost;

  const onCheckout = async () => {
    // Aquí iría la lógica de checkout
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">
        Resumen de la orden
      </h2>
      
      {/* Opciones de envío y pago */}
      <div className="mt-6">
        <ShippingPayment 
          onShippingChange={setShippingCost}
          onPaymentMethodChange={setPaymentMethod}
          totalAmount={finalTotal}
        />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Subtotal</div>
          <Currency value={totalPrice} />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-base font-medium text-gray-900">Envío</div>
          <Currency value={shippingCost} />
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-lg font-semibold text-gray-900">Total a pagar</div>
          <Currency value={finalTotal} />
        </div>
      </div>
      <Button onClick={onCheckout} disabled={items.length === 0} className="w-full mt-6">
        Finalizar compra
      </Button>
    </div>
  );
};

export default Summary; 