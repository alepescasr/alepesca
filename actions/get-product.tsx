import { Product } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product> => {
  const res = await fetch(`${URL}/${id}`, 
    {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
  );
  console.log("toma los productos???" + res);
  return res.json();
};

export default getProduct;
