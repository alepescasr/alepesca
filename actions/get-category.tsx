import { Category } from "@/types";

const getCategory = async (id: string): Promise<Category | null> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL no está definida");
      return null;
    }

    const URL = `${apiUrl}/categories/${id}`;
    console.log('Fetching category from:', URL); // Debug log

    const res = await fetch(URL, {
      next: { revalidate: 3600 }, // Revalidar cada hora
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Deshabilitar caché para desarrollo
    });

    if (!res.ok) {
      console.error(`Error al obtener la categoría: ${res.status}`, await res.text());
      return null;
    }

    const data = await res.json();
    console.log('Category response:', data); // Debug log
    
    // Validar que la respuesta tenga la estructura esperada
    if (!data || !data.id || !data.name) {
      console.error("Datos de categoría inválidos:", data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    return null;
  }
};

export default getCategory;
