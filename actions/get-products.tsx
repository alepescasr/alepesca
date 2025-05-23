import { Product } from "../types";
import qs from "query-string";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  colorId?: string;
  /* sizeId?: string; */
  isFeatured?: boolean;
  hasOffer?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  try {
    // Añadir timestamp para evitar caché
    const timestamp = new Date().getTime();

    const url = qs.stringifyUrl({
      url: URL,
      query: {
        colorId: query.colorId,
        categoryId: query.categoryId,
        isFeatured: query.isFeatured,
        hasOffer: query.hasOffer,
        t: timestamp, // Parámetro de timestamp para forzar nueva solicitud
      },
    });

    const response = await axios.get(url, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    const data = response.data;

    // Si la respuesta es un array, lo filtramos según los criterios
    if (Array.isArray(data)) {
      let filteredProducts = data;

      // Filtrar por isFeatured si está especificado
      if (query.isFeatured !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) => product.isFeatured === query.isFeatured
        );
      }

      // Filtrar por hasOffer si está especificado
      if (query.hasOffer !== undefined) {
        filteredProducts = filteredProducts.filter(
          (product) => product.hasOffer === query.hasOffer
        );
      }

      return filteredProducts;
    }

    // Si la respuesta es un objeto con una propiedad que contiene el array
    if (typeof data === "object" && data !== null) {
      const productsArray = Object.values(data).find((value) =>
        Array.isArray(value)
      );
      if (productsArray) {
        let filteredProducts = productsArray as Product[];

        // Filtrar por isFeatured si está especificado
        if (query.isFeatured !== undefined) {
          filteredProducts = filteredProducts.filter(
            (product) => product.isFeatured === query.isFeatured
          );
        }

        // Filtrar por hasOffer si está especificado
        if (query.hasOffer !== undefined) {
          filteredProducts = filteredProducts.filter(
            (product) => product.hasOffer === query.hasOffer
          );
        }

        return filteredProducts;
      }
    }

    console.error("Formato de respuesta inesperado:", data);
    return [];
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return [];
  }
};

export default getProducts;
