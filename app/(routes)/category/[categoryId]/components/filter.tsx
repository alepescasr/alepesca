"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Color } from "@/types";

interface FilterProps {
  data?: (Color | number)[];
  name: string;
  valueKey: string;
  type?: 'color' | 'price' | 'weight' | 'offer';
  minPrice?: number;
  maxPrice?: number;
}

const Filter: React.FC<FilterProps> = ({
  data,
  name,
  valueKey,
  type = 'color',
  minPrice,
  maxPrice,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get(valueKey);
  
  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: id
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true });

    router.push(url);
  }

  const onPriceChange = (min: string, max: string) => {
    const current = qs.parse(searchParams.toString());
    const query = {
      ...current,
      minPrice: min || null,
      maxPrice: max || null
    };

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true });

    router.push(url);
  }

  const onOfferChange = (checked: boolean) => {
    const current = qs.parse(searchParams.toString());
    const query = {
      ...current,
      hasOffer: checked ? 'true' : null
    };

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true });

    router.push(url);
  }

  if (type === 'price') {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold">{name}</h3>
        <hr className="my-4" />
        <div className="flex gap-x-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onChange={(e) => onPriceChange(e.target.value, searchParams.get('maxPrice') || '')}
            className="w-full border rounded-md p-2"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onChange={(e) => onPriceChange(searchParams.get('minPrice') || '', e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>
    );
  }

  if (type === 'offer') {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold">{name}</h3>
        <hr className="my-4" />
        <div className="flex items-center">
          <input
            type="checkbox"
            id="offers"
            checked={searchParams.get('hasOffer') === 'true'}
            onChange={(e) => onOfferChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="offers" className="ml-2">
            Mostrar solo ofertas
          </label>
        </div>
      </div>
    );
  }

  if (type === 'weight') {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold">{name}</h3>
        <hr className="my-4" />
        <select 
          className="w-full border rounded-md p-2"
          value={selectedValue || ""}
          onChange={(e) => onClick(e.target.value)}
        >
          <option value="">Todos los pesos</option>
          {data?.map((weight) => (
            <option key={typeof weight === 'number' ? weight : weight.id} value={typeof weight === 'number' ? weight.toString() : weight.id}>
              {typeof weight === 'number' ? `${weight} kg` : weight.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return ( 
    <div className="mb-8">
      <h3 className="text-lg font-semibold">
        {name}
      </h3>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {data?.map((filter) => {
          const isColor = typeof filter !== 'number';
          const id = isColor ? (filter as Color).id : filter.toString();
          const label = isColor ? (filter as Color).name : `${filter} kg`;
          
          return (
            <div key={id} className="flex items-center">
              <Button
                className={cn(
                  'rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300',
                  selectedValue === id && 'bg-black text-white'
                )}
                onClick={() => onClick(id)}
              >
                {label}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Filter;