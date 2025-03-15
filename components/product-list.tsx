'use client'
import ProductCard from "@/components/ui/product-card";
import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface ProductListProps {
  title: string;
  items: Product[]
}

const ProductList: React.FC<ProductListProps> = ({
  title,
  items
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    dragFree: true
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-3xl">{title}</h3>
        <div className="hidden md:flex gap-x-4">
          <button 
            onClick={scrollPrev}
            className="p-2 rounded-full bg-white border hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={scrollNext}
            className="p-2 rounded-full bg-white border hover:bg-gray-100"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      {items.length === 0 && <NoResults />}
      <div className="overflow-hidden relative" ref={emblaRef}>
        <div className="flex h-full">
          {items.map((item) => (
            <div 
              className="min-w-0 flex-[0_0_100%] md:flex-[0_0_25%] px-2 h-full" 
              key={item.id}
            >
              <div className="h-full">
                <ProductCard data={item} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
