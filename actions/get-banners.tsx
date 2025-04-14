import axios from "axios";

interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const getBanners = async (): Promise<Banner[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL no está definida");
      return [];
    }

    const URL = `${apiUrl}/billboards`;
    console.log("Fetching banners from:", URL);

    const response = await axios.get(URL);
    const data = response.data;

    console.log("Banners response:", data);

    // Validar que la respuesta sea un array
    if (!Array.isArray(data)) {
      console.error("Datos de banners inválidos:", data);
      return [];
    }

    // Filtrar solo los banners activos y ordenarlos por order
    return data
      .filter((banner: Banner) => banner.isActive)
      .sort((a: Banner, b: Banner) => a.order - b.order);
  } catch (error) {
    console.error("Error al obtener los banners:", error);
    return [];
  }
};

export default getBanners;
