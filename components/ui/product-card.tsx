"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import Button from "@/components/ui/button";

interface ProductCard {
  data: Product;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();

  const stockAvailable = data.stock || 0;
  const isOutOfStock = stockAvailable <= 0;

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    cart.addItem(data, 1);
  };
  
  return (
    <div
      onClick={handleClick}
      className="bg-white group cursor-pointer rounded-xl border p-6 h-full flex flex-col"
    >
      {/* Imagen */}
      <div className="aspect-square rounded-xl bg-primary-lightest/60 relative">
        <Image
          src={data.images?.[0]?.url}
          alt=""
          fill
          className="aspect-square object-cover rounded-md"
        />
        {/* Stock badge */}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
            Agotado
          </div>
        )}
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <Button
              className="bg-primary-light text-white"
              onClick={onAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
            </Button>
          </div>
        </div>
      </div>
      {/* Detalles del producto */}
      <div className="flex-grow">
        <p className="font-semibold text-lg overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible hover:whitespace-normal">
          {data.name}
        </p>
        <div className="flex flex-row justify-end items-center">
        <p className="text-xs text-gray-500">{data.subcategory?.name}</p>
        </div>
        
        

        {/* Stock info */}
        {stockAvailable > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {stockAvailable} unidades disponibles
          </p>
        )}
      </div>
      {/* Precio */}
      <div className="flex items-center justify-between mt-auto">
        {data.hasOffer && data.offerPrice ? (
          <>
            <div className="text-gray-500 line-through">
              <Currency value={data.price} />
            </div>
            <div className="text-lg font-bold text-primary">
              <Currency value={data.offerPrice} />
            </div>
          </>
        ) : (
          <Currency value={data.price} />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
