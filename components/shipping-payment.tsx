'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import useCart from '@/hooks/use-cart';
import axios from 'axios';
import { FormValues } from "@/app/(routes)/cart/components/form-client-info";

interface ShippingPaymentProps {
  onShippingChange: (cost: number) => void;
  onPaymentMethodChange: (method: string) => void;
  totalAmount: number;
  clientInfo: FormValues | null;
}

const ShippingPayment = ({
  onShippingChange,
  onPaymentMethodChange,
  totalAmount,
  clientInfo
}: ShippingPaymentProps) => {
  const [selectedShipping, setSelectedShipping] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showQR, setShowQR] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const cart = useCart();

  const shippingOptions = [
    { id: 'pickup', title: 'Retiro en local', description: 'Sin costo adicional', price: 0 },
    { id: 'delivery', title: 'Envío a San Rafael', description: 'Entrega a domicilio', price: 2000 }
  ];

  const handleShippingChange = (value: string) => {
    setSelectedShipping(value);
    const option = shippingOptions.find(opt => opt.id === value);
    if (option) {
      onShippingChange(option.price);
    }
  };

  const handlePaymentChange = (method: string) => {
    setPaymentMethod(method);
    onPaymentMethodChange(method);
    setShowQR(false);
  };

  const handleInitiatePayment = async () => {
    try {
      // Crear la orden en el sistema
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        items: cart.items,
        shippingMethod: selectedShipping,
        paymentMethod: 'transfer',
        shippingCost: shippingOptions.find(opt => opt.id === selectedShipping)?.price || 0,
        totalAmount
      });

      if (response.data && response.data.orderId) {
        setOrderId(response.data.orderId);
        setShowQR(true);
        toast.success('Orden creada exitosamente');
      }
    } catch (error) {
      toast.error('Error al procesar la orden');
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Opciones de envío */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Método de envío</h3>
        <div className="space-y-3">
          {shippingOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedShipping === option.id ? 'border-accent bg-accent/5' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping"
                  value={option.id}
                  checked={selectedShipping === option.id}
                  onChange={(e) => handleShippingChange(e.target.value)}
                  className="w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                />
                <div>
                  <p className="font-medium text-gray-900">{option.title}</p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
              <span className="font-medium">
                {option.price === 0 ? 'Gratis' : `₡${option.price.toLocaleString()}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Opciones de pago */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Método de pago</h3>
        <div className="space-y-4">
          {/* Opción de Tarjeta */}
          <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'card' ? 'border-accent bg-accent/5' : 'border-gray-200'
          }`}>
            <input
              type="radio"
              checked={paymentMethod === 'card'}
              onChange={() => handlePaymentChange('card')}
              className="w-4 h-4 mt-1 text-accent border-gray-300 focus:ring-accent"
              name="payment"
            />
            <div className="space-y-2">
              <span className="font-medium block">Tarjeta de crédito/débito</span>
              {paymentMethod === 'card' && (
                <p className="text-sm text-gray-600">
                  Pago seguro con tarjeta de crédito o débito
                </p>
              )}
            </div>
          </label>

          {/* Opción de Transferencia */}
          <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'transfer' ? 'border-accent bg-accent/5' : 'border-gray-200'
          }`}>
            <input
              type="radio"
              checked={paymentMethod === 'transfer'}
              onChange={() => handlePaymentChange('transfer')}
              className="w-4 h-4 mt-1 text-accent border-gray-300 focus:ring-accent"
              name="payment"
            />
            <div className="space-y-2 w-full">
              <span className="font-medium block">Transferencia Mercado Pago</span>
              {paymentMethod === 'transfer' && !showQR && (
                <div className="text-sm text-gray-600 space-y-4">
                  <p>Paga fácilmente usando Mercado Pago:</p>
                </div>
              )}
              {paymentMethod === 'transfer' && showQR && (
                <div className="text-sm text-gray-600 space-y-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
                    <p className="font-medium mb-2">Escanea este código QR con la app de Mercado Pago:</p>
                    <Image
                      src="/images/qr-mercadopago.png"
                      alt="QR Mercado Pago"
                      width={200}
                      height={200}
                      className="mb-2"
                    />
                    <p className="font-medium text-accent">@alepescasr.mp</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Información importante:</h4>
                    <div className="space-y-2 text-gray-600 mb-4">
                      <p><span className="font-medium">Número de orden:</span> {orderId}</p>
                      <p><span className="font-medium">Monto a pagar:</span> ₡{totalAmount.toLocaleString()}</p>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Pasos para completar tu compra:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Escanea el código QR con la app de Mercado Pago</li>
                      <li>Realiza el pago por el monto exacto indicado arriba</li>
                      <li>Una vez realizado el pago, envía por WhatsApp:
                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                          <li>Número de orden: {orderId}</li>
                          <li>Captura del comprobante de pago</li>
                          <li>Tu nombre completo</li>
                        </ul>
                      </li>
                    </ol>
                    <a 
                      href={`https://wa.me/50683029383?text=Hola, he realizado el pago de mi orden ${orderId} por ₡${totalAmount.toLocaleString()}. Adjunto el comprobante de pago.`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors text-base font-medium"
                      onClick={() => {
                        cart.removeAll();
                        localStorage.removeItem('cart-storage');
                      }}
                    >
                      Enviar comprobante por WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
      </div>

      {!clientInfo && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Información de envío incompleta
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Por favor, completa la información de envío antes de proceder con el pago.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingPayment; 