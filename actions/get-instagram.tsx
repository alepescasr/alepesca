import axios from 'axios';
import { InstagramPost } from "@/types/instagram";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/posts`;

const getInstagram = async (): Promise<InstagramPost[]> => {
  try {
    const response = await axios.get(`${URL}` );
    

    return response.data;
  } catch (error) {
    console.error('Error al obtener el Instagram:', error);
    throw error;
  }
};

export default getInstagram;
