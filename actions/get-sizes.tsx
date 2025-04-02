import { Size } from "@/types";
import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`;

const getSizes = async (): Promise<Size[]> => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener sizes:", error);
    return [];
  }
};

export default getSizes;
