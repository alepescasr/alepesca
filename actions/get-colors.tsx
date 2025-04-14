import { Color } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/colors`;

const getColors = async (): Promise<Color[]> => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener colors:", error);
    return [];
  }
};

export default getColors;
