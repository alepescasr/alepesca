import { Product } from "@/types";
import qs from "query-string";

interface Query {
  categoryId?: string;
  colorId?: string;
  isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL no está definida");
      return [];
    }

    const URL = `${apiUrl}/products`;
    
    // Construir la URL con los parámetros de consulta
    const url = qs.stringifyUrl({
      url: URL,
      query: {
        categoryId: query.categoryId,
        colorId: query.colorId,
        isFeatured: query.isFeatured,
      },
    });

    console.log('Fetching products from:', url); // Debug log

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidar cada hora
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      console.error(`Error al obtener productos: ${res.status}`, await res.text());
      return [];
    }

    const data = await res.json();
    console.log('Products response:', data); // Debug log

    // Validar que la respuesta sea un array
    if (!Array.isArray(data)) {
      console.error("Respuesta inválida de productos:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

export default getProducts;
