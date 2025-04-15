import axios from "axios";
import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product> => {
  try {
    // Agregar timestamp para evitar caché
    const timestamp = new Date().getTime();
    const response = await axios.get(`${URL}/${id}?t=${timestamp}`, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
};

export default getProduct;
