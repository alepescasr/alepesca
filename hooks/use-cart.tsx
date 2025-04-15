import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";

import { Product } from "@/types";
import { AlertTriangle } from "lucide-react";

interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (data: Product, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  hydrated: boolean;
  setHydrated: (state: boolean) => void;
}

const useCartStore = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      hydrated: false,
      setHydrated: (state) => set({ hydrated: state }),
      addItem: (data: Product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === data.id
        );

        // Validar que la cantidad sea un número positivo
        if (quantity <= 0) {
          return toast.error("La cantidad debe ser mayor a 0");
        }

        // Validar contra el stock disponible
        if (data.stock !== undefined && data.stock !== null) {
          // Si el item ya existe, verificar que la cantidad total no exceda el stock
          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > data.stock) {
              return toast.error(`Solo hay ${data.stock} unidades disponibles`);
            }

            // Actualizar la cantidad del item existente
            set({
              items: currentItems.map((item) =>
                item.product.id === data.id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            });

            return toast.success(`Cantidad actualizada (${newQuantity})`);
          } else {
            // Verificar que la cantidad no exceda el stock para un nuevo item
            if (quantity > data.stock) {
              return toast.error(`Solo hay ${data.stock} unidades disponibles`);
            }
          }
        }

        // Si el item no existe, añadirlo al carrito
        if (!existingItem) {
          set({
            items: [...currentItems, { product: data, quantity }],
          });
          toast.success("Producto añadido al carrito");
        }
      },
      updateQuantity: (id: string, quantity: number) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.product.id === id
        );

        if (!existingItem) {
          return toast.error("Producto no encontrado en el carrito");
        }

        // Validar que la cantidad sea un número positivo
        if (quantity <= 0) {
          return toast.error("La cantidad debe ser mayor a 0");
        }

        // Validar contra el stock disponible
        if (
          existingItem.product.stock !== undefined &&
          existingItem.product.stock !== null
        ) {
          if (quantity > existingItem.product.stock) {
            return toast.error(
              `Solo hay ${existingItem.product.stock} unidades disponibles`
            );
          }
        }

        // Actualizar la cantidad
        set({
          items: currentItems.map((item) =>
            item.product.id === id ? { ...item, quantity } : item
          ),
        });

        toast.success("Cantidad actualizada");
      },
      removeItem: (id: string) => {
        set({
          items: [...get().items.filter((item) => item.product.id !== id)],
        });
        toast.success("Producto eliminado del carrito");
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => JSON.stringify({ state: { items: [] }, version: 0 }),
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

// Hook personalizado para manejar la hidratación
// Variante sin selector: devuelve el store completo
function useCart(): CartStore;
// Variante con selector: devuelve el resultado del selector
function useCart<T>(selector: (state: CartStore) => T): T;
// Implementación
function useCart<T>(selector?: (state: CartStore) => T) {
  const store = useCartStore();

  useEffect(() => {
    // Marcar como hidratado después de la primera renderización en el cliente
    if (!store.hydrated) {
      store.setHydrated(true);
    }
  }, [store]);

  // Si hay un selector, devuelve el resultado de aplicarlo al store
  // Si no hay selector, devuelve el store completo
  return selector ? selector(store) : store;
}

export default useCart;
