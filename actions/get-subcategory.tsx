import axios from 'axios';
import { Subcategory } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/subcategories`;

const getSubcategory = async (id: string): Promise<Subcategory> => {
  try {
    const response = await axios.get(`${URL}/${id}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    throw error;
  }
};

export default getSubcategory;
