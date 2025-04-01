import { Category } from "@/types";

const getCategories = async (): Promise<Category[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL no está definida");
      return [];
    }

    const URL = `${apiUrl}/categories`;
    console.log('Fetching categories from:', URL);

    const res = await fetch(URL, {
      /* next: { revalidate: 3600 }, */
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      console.error(`Error al obtener las categorías: ${res.status}`, await res.text());
      return [];
    }

    const data = await res.json();
    console.log('Categories response:', data);

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

