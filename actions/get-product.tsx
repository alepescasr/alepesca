import axios from 'axios';
import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get(`${URL}/${id}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    throw error;
  }
};

export default getProduct;
