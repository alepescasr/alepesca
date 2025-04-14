import axios from "axios";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

export interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  hasOffer?: boolean;
}

const getProducts = async (query: Query): Promise<any[]> => {
  try {
    const response = await axios.get(URL, {
      params: query,
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

export default getProducts;
