import { Category } from "@/types";

const getCategory = async (id: string): Promise<Category | null> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL no está definida");
      return null;
    }

    const URL = `${apiUrl}/categories/${id}`;
    console.log('Fetching category from:', URL);

    const res = await fetch(URL, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      console.error(`Error al obtener la categoría: ${res.status}`, await res.text());
      return null;
    }

    const data = await res.json();
    console.log('Category response:', data);

    // Validar que la respuesta tenga la estructura esperada
    if (!data || !data.id) {
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
