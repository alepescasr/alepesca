"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import useCart, { CartStore } from "@/hooks/use-cart";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FormValues } from "@/app/(routes)/cart/components/form-client-info";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";

interface CartItem {
  product: {
    id: string;
    name: string;
    price: string;
    offerPrice?: string;
    hasOffer?: boolean;
  };
  quantity: number;
}

interface SummaryProps {
  shippingCost: number;
  paymentMethod: string;
  onTotalChange: (total: number) => void;
  clientInfo: FormValues | null;
}

const Summary = ({
  shippingCost,
  paymentMethod,
  onTotalChange,
  clientInfo,
}: SummaryProps) => {
  const searchParams = useSearchParams();
  const cart = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [requestStarted, setRequestStarted] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [responseReceived, setResponseReceived] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    console.log("====== COMPONENTE SUMMARY MONTADO ======");
    console.log("Entorno:", process.env.NODE_ENV);
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  useEffect(() => {
    if (searchParams.get("success")) {
      cart.removeAll();
    }
  }, [searchParams, cart]);

  // Función para agregar logs a la consola y al estado
  const addLog = (message: string) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
    setLogMessages((prev) => [
      ...prev,
      `[${new Date().toISOString()}] ${message}`,
    ]);
  };

  const totalPrice = cart.items.reduce((total, item) => {
    const itemPrice =
      item.product.hasOffer && item.product.offerPrice
        ? Number(item.product.offerPrice)
        : Number(item.product.price);
    return total + itemPrice * item.quantity;
  }, 0);

  const finalTotal = totalPrice + shippingCost;

  useEffect(() => {
    onTotalChange(finalTotal);
  }, [finalTotal, onTotalChange]);

  const checkApiConnection = async (url: string): Promise<boolean> => {
    addLog(`Verificando conexión con API: ${url}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${url}/healthcheck`, {
        method: "HEAD",
        cache: "no-cache",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      addLog(
        `Conectividad API: ${response.ok ? "OK" : "Error"} (${response.status})`
      );
      return response.ok;
    } catch (error: any) {
      addLog(
        `Error verificando conexión API: ${error.name} - ${error.message}`
      );
      return false;
    }
  };

  const onCheckout = async () => {
    addLog("-----------------------------------");
    addLog("INICIANDO PROCESO DE CHECKOUT");

    // Limpiar logs anteriores
    setLogMessages([]);

    try {
      if (!clientInfo) {
        addLog("Error: No hay información de cliente");
        return toast.error("Por favor, completa la información de envío");
      }

      if (cart.items.length === 0) {
        addLog("Error: Carrito vacío");
        return toast.error("Tu carrito está vacío");
      }

      setIsLoading(true);
      setApiError(null);
      setRequestStarted(true);
      setRequestSent(false);
      setResponseReceived(false);

      // Toast de carga persistente
      const loadingToastId = toast.loading(
        "Procesando tu solicitud...",
        { duration: Infinity } // Permanecerá hasta que lo eliminemos manualmente
      );

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      addLog(`URL API configurada: ${apiUrl || "NO DEFINIDA"}`);

      // Añadimos un delay intencional para ver la carga
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verificación explícita de configuración
      if (!apiUrl) {
        addLog("ERROR CRÍTICO: URL de API no configurada");
        toast.dismiss(loadingToastId);
        setApiError("Error de configuración: URL de API no definida");
        toast.error("Error de configuración");
        setIsLoading(false);
        setRequestStarted(false);
        return;
      }

      // Verificar conectividad con el API primero
      addLog("Verificando conectividad con el servidor...");
      const isApiAvailable = await checkApiConnection(apiUrl);

      if (!isApiAvailable) {
        addLog("ERROR: No se puede conectar con el servidor");
        toast.dismiss(loadingToastId);
        setApiError(
          "No se puede conectar con el servidor. Por favor, verifica tu conexión a internet."
        );
        toast.error("No se puede conectar con el servidor");
        setIsLoading(false);
        setRequestStarted(false);
        return;
      }

      addLog("Conexión con el servidor establecida");

      if (paymentMethod === "transfer") {
        // Caso de pago por transferencia
        const transferEndpoint = `${apiUrl}/transfer`;
        addLog(
          `Preparando solicitud al endpoint especializado: ${transferEndpoint}`
        );

        // Convertir items al formato esperado por el backend
        const cartItems = cart.items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.hasOffer
            ? Number(item.product.offerPrice)
            : Number(item.product.price),
        }));

        // Estructura de datos adaptada a lo que espera el endpoint del backend
        const transferData = {
          cartItems,
          cartItemsCount: cart.items.length,
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

        addLog(
          `Datos a enviar al endpoint de transferencia: ${JSON.stringify(
            transferData,
            null,
            2
          )}`
        );

        try {
          // Marcar que se envió la solicitud
          setRequestSent(true);
          addLog("ENVIANDO SOLICITUD AL ENDPOINT DE TRANSFERENCIA...");

          const startTime = Date.now();
          const response = await axios.post(transferEndpoint, transferData, {
            timeout: 20000, // Timeout de 20 segundos
            headers: {
              "Content-Type": "application/json",
              // Eliminamos el encabezado X-Payment-Method que causaba el error CORS
            },
          });
          const endTime = Date.now();

          setResponseReceived(true);
          addLog(`RESPUESTA RECIBIDA en ${endTime - startTime}ms`);
          addLog(`Código de estado: ${response.status}`);
          addLog(`Datos recibidos: ${JSON.stringify(response.data)}`);

          // Solo procedemos si tenemos una respuesta exitosa
          if (response.status !== 200 && response.status !== 201) {
            addLog(
              `ERROR: Respuesta con código inesperado: ${response.status}`
            );
            throw new Error(
              `Respuesta inesperada del servidor: ${response.status}`
            );
          }

          // Verificar explícitamente que la respuesta tenga orderId
          if (!response.data || !response.data.orderId) {
            addLog("ERROR: La respuesta no contiene ID de orden");
            throw new Error(
              "La respuesta del servidor no contiene un ID de orden válido"
            );
          }

          // Esperamos un segundo antes de mostrar el éxito (para asegurar que se vea el proceso)
          addLog("Procesando respuesta exitosa...");
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Eliminar toast de carga
          toast.dismiss(loadingToastId);

          // Solo mostrar éxito si realmente obtuvimos una respuesta
          addLog(`ÉXITO: Orden ${response.data.orderId} creada correctamente`);
          setOrderId(response.data.orderId);
          setShowQR(true);

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
        } catch (axiosError: any) {
          setResponseReceived(true);
          addLog(`ERROR EN LA PETICIÓN: ${axiosError.message}`);

          toast.dismiss(loadingToastId);

          if (axiosError.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            addLog(`Respuesta de error: Código ${axiosError.response.status}`);
            addLog(`Datos: ${JSON.stringify(axiosError.response.data || {})}`);

            setApiError(
              `Error del servidor: ${
                axiosError.response.status
              } - ${JSON.stringify(axiosError.response.data || {})}`
            );
            toast.error(`Error del servidor: ${axiosError.response.status}`);
          } else if (axiosError.request) {
            // La petición se hizo pero no se recibió respuesta
            addLog("No se recibió respuesta del servidor");
            addLog(`Request: ${JSON.stringify(axiosError.request)}`);

            setApiError(
              "No se recibió respuesta del servidor. La orden no fue procesada."
            );
            toast.error("No se recibió respuesta del servidor");
          } else {
            // Algo ocurrió al configurar la petición
            addLog(`Error al configurar la petición: ${axiosError.message}`);

            setApiError(`Error: ${axiosError.message}`);
            toast.error(`Error: ${axiosError.message}`);
          }

          // Importante: No avanzar si hubo error
          setShowQR(false);
        }
      } else {
        // Caso de pago con tarjeta
        // Preparar los datos para la solicitud de pago
        const cartItems = cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

        // Incluir la información del cliente en los datos del pedido
        const orderFormData = {
          shippingCost,
          paymentMethod,
          clientInfo,
        };

        const checkoutEndpoint = `${apiUrl}/checkout`;
        addLog(`Preparando solicitud al endpoint: ${checkoutEndpoint}`);

        const checkoutData = {
          cartItems,
          orderFormData,
        };

        addLog(`Datos a enviar: ${JSON.stringify(checkoutData)}`);

        try {
          // Marcar que se envió la solicitud
          setRequestSent(true);
          addLog("ENVIANDO SOLICITUD AL SERVIDOR...");

          const startTime = Date.now();
          // Enviar datos completos
          const response = await axios.post(checkoutEndpoint, checkoutData, {
            timeout: 20000, // Timeout de 20 segundos
            headers: {
              "Content-Type": "application/json",
              "X-Request-Time": new Date().toISOString(),
            },
          });
          const endTime = Date.now();

          setResponseReceived(true);
          addLog(`RESPUESTA RECIBIDA en ${endTime - startTime}ms`);
          addLog(`Código de estado: ${response.status}`);
          addLog(`Datos recibidos: ${JSON.stringify(response.data)}`);

          // Solo procedemos si tenemos una respuesta exitosa
          if (response.status !== 200 && response.status !== 201) {
            addLog(
              `ERROR: Respuesta con código inesperado: ${response.status}`
            );
            throw new Error(
              `Respuesta inesperada del servidor: ${response.status}`
            );
          }

          // Verificar explícitamente que la respuesta tenga URL
          if (!response.data || !response.data.url) {
            addLog("ERROR: La respuesta no contiene URL de pago");
            throw new Error(
              "La respuesta del servidor no contiene una URL de pago válida"
            );
          }

          // Esperamos un segundo antes de redirigir (para asegurar que se vea el proceso)
          addLog("Procesando respuesta exitosa...");
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Eliminar toast de carga
          toast.dismiss(loadingToastId);

          // Redirigir al usuario solo si hay URL válida
          addLog(`ÉXITO: Redirigiendo a ${response.data.url}`);
          window.location.href = response.data.url;
        } catch (axiosError: any) {
          setResponseReceived(true);
          addLog(`ERROR EN LA PETICIÓN: ${axiosError.message}`);

          toast.dismiss(loadingToastId);

          if (axiosError.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            addLog(`Respuesta de error: Código ${axiosError.response.status}`);
            addLog(`Datos: ${JSON.stringify(axiosError.response.data || {})}`);

            setApiError(
              `Error del servidor: ${
                axiosError.response.status
              } - ${JSON.stringify(axiosError.response.data || {})}`
            );
            toast.error(`Error del servidor: ${axiosError.response.status}`);
          } else if (axiosError.request) {
            // La petición se hizo pero no se recibió respuesta
            addLog("No se recibió respuesta del servidor");
            addLog(`Request: ${JSON.stringify(axiosError.request)}`);

            setApiError(
              "No se recibió respuesta del servidor. El checkout no fue procesado."
            );
            toast.error("No se recibió respuesta del servidor");
          } else {
            // Algo ocurrió al configurar la petición
            addLog(`Error al configurar la petición: ${axiosError.message}`);

            setApiError(`Error: ${axiosError.message}`);
            toast.error(`Error: ${axiosError.message}`);
          }
        }
      }
    } catch (error: any) {
      console.error("Error general durante el checkout:", error);
      addLog(`ERROR GENERAL: ${error.message}`);
      toast.error("Error al procesar el pago");
    } finally {
      setIsLoading(false);
      setRequestStarted(false);
      addLog("PROCESO DE CHECKOUT FINALIZADO");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Resumen de la orden</h2>

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
          <div className="text-lg font-semibold text-gray-900">
            Total a pagar
          </div>
          <Currency value={finalTotal} />
        </div>
      </div>

      {apiError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Error en la conexión con el servidor
              </p>
              <p className="text-sm text-red-700 mt-1">
                La orden no fue creada. Por favor intenta nuevamente.
              </p>
              <details className="mt-1">
                <summary className="text-xs text-red-500 cursor-pointer">
                  Ver detalles técnicos
                </summary>
                <p className="mt-1 text-xs text-red-500 whitespace-pre-wrap">
                  {apiError}
                </p>
              </details>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "transfer" && showQR && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
            <p className="text-green-800 text-sm">
              <span className="font-bold">¡Orden creada correctamente!</span>{" "}
              Ahora puedes realizar el pago.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información de transferencia
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <p className="font-medium mb-2">
                  Escanea este código QR con la app de Mercado Pago:
                </p>
                <div className="relative w-48 h-48 my-2">
                  <img
                    src="/images/qr-mercadopago.png"
                    alt="QR Mercado Pago"
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
                    cart.removeAll();
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

      {!showQR && (
        <Button
          onClick={onCheckout}
          disabled={cart.items.length === 0 || isLoading || !clientInfo}
          className="w-full mt-6 relative"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {requestStarted
                ? requestSent
                  ? responseReceived
                    ? "Procesando respuesta..."
                    : "Esperando respuesta..."
                  : "Enviando solicitud..."
                : "Inicializando..."}
            </span>
          ) : (
            "Finalizar compra"
          )}
        </Button>
      )}

      {/* Indicador de estado de conexión para depuración */}
      {isLoading && (
        <div className="mt-2 text-xs text-gray-500 flex flex-col">
          <span>
            Estado:{" "}
            {requestStarted
              ? requestSent
                ? responseReceived
                  ? "Procesando respuesta"
                  : "Esperando servidor"
                : "Enviando datos"
              : "Preparando solicitud"}
          </span>
        </div>
      )}

      {/* Panel de logs para desarrollo - solo visible en modo desarrollo */}
      {process.env.NODE_ENV === "development" && logMessages.length > 0 && (
        <div className="mt-4 text-xs text-gray-600 bg-gray-100 p-2 rounded-md max-h-40 overflow-y-auto">
          <details>
            <summary className="font-medium cursor-pointer">
              Ver logs ({logMessages.length})
            </summary>
            <div className="mt-2 space-y-1">
              {logMessages.map((log, index) => (
                <div
                  key={index}
                  className="whitespace-pre-wrap font-mono text-xs"
                >
                  {log}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default Summary;
