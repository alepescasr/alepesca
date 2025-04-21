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
import { Loader2, CheckCircle } from "lucide-react";

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
  clientInfo,
}) => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showOrderInfo, setShowOrderInfo] = useState(false);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success(
        "¡Compra exitosa! Por favor, envía el comprobante por WhatsApp."
      );
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
      toast.error(
        "Por favor, completa la información de envío antes de proceder con el pago."
      );
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
        clientInfo,
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

  const handleMercadoPagoConfirm = async () => {
    if (!clientInfo) {
      toast.error(
        "Por favor, completa la información de envío antes de proceder."
      );
      return;
    }

    setIsLoading(true);
    const loadingToastId = toast.loading("Procesando tu solicitud...", {
      duration: Infinity,
    });

    try {
      console.log("Iniciando solicitud al endpoint de transferencia...");

      // Convertir items a formato esperado por el backend
      const cartItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.hasOffer
          ? Number(item.product.offerPrice)
          : Number(item.product.price),
      }));

      // Preparar los datos en el formato que espera el backend
      const transferData = {
        cartItems,
        cartItemsCount: items.length,
        orderFormData: {
          shippingMethod: "pickup",
          paymentMethod: "transfer",
          shippingFee: shippingCost,
          totalAmount: finalTotal,
          clientInfo,
        },
        shippingFee: shippingCost,
        totalAmount: finalTotal,
      };

      console.log("Datos para enviar:", JSON.stringify(transferData, null, 2));

      // Realizar la solicitud al nuevo endpoint específico para transferencias
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/transfer`, transferData, {
        timeout: 20000,
        headers: {
          "Content-Type": "application/json",
          // Eliminamos el encabezado X-Payment-Method que causaba problemas CORS
        },
      });

      console.log("Respuesta recibida:", response.data);

      // Verificar la respuesta
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(
          `Respuesta inesperada del servidor: ${response.status}`
        );
      }

      if (!response.data || !response.data.orderId) {
        throw new Error("La respuesta del servidor no contiene un ID de orden");
      }

      // Eliminar toast de carga
      toast.dismiss(loadingToastId);

      // Guardar el ID de orden y mostrar información
      setOrderId(response.data.orderId);
      setShowOrderInfo(true);

      // Mostrar toast de éxito personalizado
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Orden creada exitosamente
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Orden #{response.data.orderId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    } catch (error) {
      console.error("Error al procesar la transferencia:", error);
      toast.dismiss(loadingToastId);
      toast.error(
        "Error al procesar la transferencia. Por favor, intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Resumen del pedido</h2>
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

      {paymentMethod === "mercadopago" && !showOrderInfo && (
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
                  <span className="font-semibold">Importante:</span> Después de
                  realizar el pago, por favor envía el comprobante por WhatsApp
                  al número de la tienda para confirmar tu pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "transfer" && !showOrderInfo && (
        <div className="mt-6 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información de transferencia
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tipo:</p>
                <p className="text-lg font-semibold text-gray-900">
                  Mercado Pago
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Alias de Mercado Pago:</p>
                <p className="text-lg font-semibold text-gray-900">
                  alepescasr.mp
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Titular:</p>
                <p className="text-lg font-semibold text-gray-900">
                  Alejandro Pescar
                </p>
              </div>
              <div className="relative w-full h-48">
                <Image
                  src="/images/qr-mercadopago.png"
                  alt="QR de Mercado Pago"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Importante:</span> Después de
                  realizar la transferencia, por favor envía el comprobante por
                  WhatsApp al número de la tienda para confirmar tu pedido.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar información después de crear la orden */}
      {showOrderInfo && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
            <p className="text-green-800 text-sm">
              <span className="font-bold">
                ¡Orden #{orderId} creada correctamente!
              </span>{" "}
              Ahora puedes realizar el pago.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información de pago
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <p className="font-medium mb-2">
                  Escanea este código QR con la app de Mercado Pago:
                </p>
                <div className="relative w-48 h-48 my-2">
                  <Image
                    src="/images/qr-mercadopago.png"
                    alt="QR Mercado Pago"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="font-medium text-accent">@alepescasr.mp</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Información importante:
                </h4>
                <div className="space-y-2 text-gray-600 mb-4">
                  <p>
                    <span className="font-medium">Número de orden:</span>{" "}
                    {orderId}
                  </p>
                  <p>
                    <span className="font-medium">Monto a pagar:</span> $
                    {finalTotal.toLocaleString()}
                  </p>
                </div>
                <a
                  href={`https://wa.me/50683029383?text=Hola, he realizado el pago de mi orden ${orderId} por $${finalTotal.toLocaleString()}. Adjunto el comprobante de pago.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors text-base font-medium"
                  onClick={() => {
                    removeAll();
                    localStorage.removeItem("cart-storage");
                  }}
                >
                  Enviar comprobante por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        {!showOrderInfo &&
          (paymentMethod === "mercadopago" ? (
            <Button
              onClick={handleMercadoPagoConfirm}
              disabled={!clientInfo || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </span>
              ) : (
                "Confirmar pago con Mercado Pago"
              )}
            </Button>
          ) : paymentMethod === "transfer" ? (
            <Button
              onClick={handleMercadoPagoConfirm}
              disabled={!clientInfo || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </span>
              ) : (
                "Confirmar transferencia"
              )}
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
          ))}
      </div>
    </div>
  );
};

export default Summary;
