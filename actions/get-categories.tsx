import { Category } from "@/types";
import axios from "axios";

const getCategories = async (): Promise<Category[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL no está definida");
      return [];
    }

    const URL = `${apiUrl}/categories`;
    console.log("Fetching categories from:", URL);

    const response = await axios.get(URL);
    const data = response.data;

    console.log("Categories response:", data);

    // Validar que la respuesta sea un array
    if (!Array.isArray(data)) {
      console.error("Datos de categorías inválidos:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return [];
  }
};

export default getCategories;
