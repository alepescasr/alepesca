"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Dialog } from "@headlessui/react";

import IconButton  from "@/components/ui/icon-button";
import Button from "@/components/ui/button";
import { Color, Size } from "@/types";

import Filter from "./filter";

interface MobileFiltersProps {
  colors: Color[];
  minPrice: number;
  maxPrice: number;
  weights: number[]; // Cambiado a number[] ya que son valores numéricos directos
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  colors,
  minPrice,
  maxPrice,
  weights
}) => {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={onOpen}
        className="flex items-center gap-x-2 lg:hidden"
      >
        Filtros
        <Plus size={20} />
      </Button>

      <Dialog open={open} as="div" className="relative z-40 lg:hidden" onClose={onClose}>
        {/* ... existing Dialog background code ... */}
        
        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
            <div className="flex items-center justify-end px-4">
              <IconButton icon={<X size={15} />} onClick={onClose} />
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Peso</h3>
                <select 
                  className="w-full border rounded-md p-2"
                  defaultValue=""
                >
                  <option value="">Todos los pesos</option>
                  {weights.map((weight) => (
                    <option key={weight} value={weight}>
                      {weight} kg
                    </option>
                  ))}
                </select>
              </div>
              <Filter 
                valueKey="colorId" 
                name="Colores" 
                data={colors}
              />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Rango de Precio</h3>
                <div className="flex gap-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full border rounded-md p-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full border rounded-md p-2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Ofertas</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="offers"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="offers" className="ml-2 text-sm">
                    Mostrar solo ofertas
                  </label>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default MobileFilters;
