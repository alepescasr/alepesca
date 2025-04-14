import { Category } from "@/types";
import axios from "axios";
import getProducts from "./get-products";

const getCategories = async (): Promise<Category[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL no está definida");
      return [];
    }

    const URL = `${apiUrl}/categories`;
    

    const response = await axios.get(URL);
    const data = response.data;

    

    // Validar que la respuesta sea un array
    if (!Array.isArray(data)) {
      console.error("Datos de categorías inválidos:", data);
      return [];
    }

    // Filtrar categorías que tienen productos
    const categoriesWithProducts = await Promise.all(
      data.map(async (category) => {
        const products = await getProducts({ categoryId: category.id });
        return products.length > 0 ? category : null;
      })
    );

    // Filtrar las categorías nulas y devolver solo las que tienen productos
    return categoriesWithProducts.filter((category): category is Category => category !== null);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return [];
  }
};

export default getCategories;
