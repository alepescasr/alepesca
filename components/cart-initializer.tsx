"use client";

import { useEffect } from "react";
import useCart from "@/hooks/use-cart";

// Este componente se encarga de inicializar el carrito cuando se carga la aplicación
const CartInitializer = () => {
  // Ahora podemos usar useCart sin selector
  const cart = useCart();

  useEffect(() => {
    // La hidratación ocurre automáticamente en el hook useCart
    // Aquí solo necesitamos asegurarnos de que el componente se monte
  }, []);

  return null; // Este componente no renderiza nada, solo inicializa el carrito
};

export default CartInitializer;
