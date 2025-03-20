import { Product } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
}

// Implementamos cache para reducir llamadas repetidas
const cache: Record<string, { data: Product[]; timestamp: number }> = {};
const CACHE_DURATION = 60000; // 1 minuto

const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      colorId: query.colorId,
      sizeId: query.sizeId,
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
    },
  });

  // Verificar si tenemos una versión cacheada y válida
  const now = Date.now();
  if (cache[url] && now - cache[url].timestamp < CACHE_DURATION) {
    console.log("Using cached products data");
    return cache[url].data;
  }

  // Añadir timeout para evitar esperas indefinidas
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 }, // Revalidar cada minuto
    });

    const data = await res.json();

    // Guardar en cache
    cache[url] = {
      data,
      timestamp: now,
    };

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);

    // Si hay un error y tenemos datos en caché (incluso vencidos), úsalos como fallback
    if (cache[url]) {
      console.log("Using stale cache as fallback");
      return cache[url].data;
    }

    // Si no hay fallback, devolver array vacío
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};

export default getProducts;
