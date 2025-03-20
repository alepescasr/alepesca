import Image from "next/image";
import { toast } from "react-hot-toast";
import { Minus, Plus, X } from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

interface CartItemProps {
  data: {
    product: Product;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();
  const { product, quantity } = data;

  const stockAvailable = product.stock || 0;

  const onRemove = () => {
    cart.removeItem(product.id);
  };

  const onIncrementQuantity = () => {
    if (quantity < stockAvailable) {
      cart.updateQuantity(product.id, quantity + 1);
    }
  };

  const onDecrementQuantity = () => {
    if (quantity > 1) {
      cart.updateQuantity(product.id, quantity - 1);
    }
  };

  // Calcular precio según si tiene oferta o no
  const itemPrice =
    product.hasOffer && product.offerPrice
      ? Number(product.offerPrice)
      : Number(product.price);

  // Calcular subtotal del item
  const subtotal = itemPrice * quantity;

  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={product.images[0].url}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">{product.name}</p>
          </div>

          <div className="mt-1 flex text-sm">
            {product.color && (
              <p className="text-gray-500">{product.color.name}</p>
            )}
            {product.weight && (
              <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                {product.weight}
              </p>
            )}
          </div>

          {/* Precio unitario */}
          <div className="mt-2">
            {product.hasOffer && product.offerPrice ? (
              <div className="flex flex-col">
                <span className="line-through text-sm text-gray-500">
                  <Currency value={product.price} />
                </span>
                <Currency value={product.offerPrice} />
              </div>
            ) : (
              <Currency value={product.price} />
            )}
          </div>

          {/* Control de cantidad */}
          <div className="mt-4 sm:mt-0 sm:pr-9 flex flex-col">
            <div className="flex items-center border border-gray-300 w-28 rounded-md">
              <button
                onClick={onDecrementQuantity}
                disabled={quantity <= 1}
                className="px-3 py-1 text-sm disabled:opacity-50"
              >
                <Minus size={14} />
              </button>
              <div className="flex-1 text-center text-sm">{quantity}</div>
              <button
                onClick={onIncrementQuantity}
                disabled={quantity >= stockAvailable}
                className="px-3 py-1 text-sm disabled:opacity-50"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Subtotal */}
            <div className="mt-2 text-right font-medium">
              <p className="text-xs text-gray-500">Subtotal:</p>
              <Currency value={subtotal.toString()} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
