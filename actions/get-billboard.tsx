 import { Billboard } from "@/types";

const getBillboard = async (id: string): Promise<Billboard | null> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL no está definida");
      return null;
    }

    const URL = `${apiUrl}/billboards/${id}`;
    console.log('Fetching billboard from:', URL); // Debug log

    const res = await fetch(URL, {
      next: { revalidate: 3600 }, // Revalidar cada hora
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      console.error(`Error al obtener el billboard: ${res.status}`, await res.text());
      return null;
    }
    if (res.status === 404) {
      //cargar imagen de imágenes/billboard-default.jpg
      const defaultImage = await fetch('/images/billboard-default.jpg');
      const defaultImageData = await defaultImage.json();
      return defaultImageData;
    }


    const data = await res.json();
    console.log('Billboard response:', data); // Debug log

    // Validar que la respuesta tenga la estructura esperada
    if (!data || !data.id) {
      console.error("Datos de billboard inválidos:", data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error al obtener el billboard:", error);
    return null;
  }
};

export default getBillboard;
