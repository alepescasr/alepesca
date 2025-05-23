import { Billboard } from "@/types";
import axios from "axios";

const getBillboard = async (id: string): Promise<Billboard | null> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL no está definida");
      return null;
    }

    const URL = `${apiUrl}/billboards/${id}`;
   

    const response = await axios.get(URL);
    const data = response.data;

   

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
