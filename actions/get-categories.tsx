import { Category } from "@/types";

const getCategories = async (): Promise<Category[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL no está definida");
      return [];
    }

    const URL = `${apiUrl}/categories`;
    const res = await fetch(URL);

    if (!res.ok) {
      throw new Error(`Error al obtener categorías: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
};

export default getCategories;

