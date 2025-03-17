"use client";

import { ShoppingCart } from "lucide-react";

import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";

interface InfoProps {
  data: Product
};

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();

  const onAddToCart = () => {
    cart.addItem(data);
  }

  return ( 
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <div className="flex flex-col">
          {data.hasOffer && data.offerPrice ? (
            <>
              <p className="text-xl text-gray-500 line-through">
                <Currency value={data.price} />
              </p>
              <p className="text-2xl text-red-600 font-semibold">
                <Currency value={data.offerPrice} />
              </p>
            </>
          ) : (
            <p className="text-2xl text-gray-900">
              <Currency value={data.price} />
            </p>
          )}
        </div>
      </div>
      <hr className="my-4" />
      {data.description && (
        <div className="mt-4 text-gray-600">
          <h3 className="font-semibold text-black mb-2">Descripción:</h3>
          <p>{data.description}</p>
        </div>
      )}
      <div className="flex flex-col gap-y-6 mt-6">
        {data.weight && (
          <div className="flex items-center gap-x-4">
            <h3 className="font-semibold text-black">Altura:</h3>
            <div>
              {data.weight}
            </div>
          </div>
        )}
        {data.color && (
          <div className="flex items-center gap-x-4">
            <h3 className="font-semibold text-black">Color:</h3>
            <div className="h-6 w-6 rounded-full border border-gray-600" style={{ backgroundColor: data.color?.value }} />
          </div>
        )}
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
          Agregar al carrito
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
}
 
export default Info;
