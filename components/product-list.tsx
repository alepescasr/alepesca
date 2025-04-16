'use client'

import ProductCard from "@/components/ui/product-card";
import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import getProducts from "@/actions/get-products";

interface ProductListProps {
  title: string;
  items: Product[];
  queryParams?: {
    isFeatured?: boolean;
    hasOffer?: boolean;
    categoryId?: string;
  };
}

const ProductList: React.FC<ProductListProps> = ({
  title,
  items: initialItems,
  queryParams
}) => {
  // Use a ref to keep track of whether the component has mounted
  const isMounted = useRef(false);
  // Initialize state with initial items
  const [items, setItems] = useState<Product[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    dragFree: false,
    skipSnaps: false,
    containScroll: 'trimSnaps',
    slidesToScroll: 1
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Function to fetch latest products
  const fetchLatestProducts = useCallback(async () => {
    if (!queryParams) return;
    
    try {
      setIsLoading(true);
      const latestProducts = await getProducts(queryParams);
      
      // Critical check: Only update if we got valid data back
      if (latestProducts && latestProducts.length > 0) {
        setItems(latestProducts);
        
        // If carousel exists and products changed, reset it
        if (emblaApi) {
          setTimeout(() => {
            emblaApi.reInit();
          }, 100); // Small delay to ensure DOM updates
        }
      }
    } catch (error) {
      console.error("Failed to fetch latest products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams, emblaApi]);

  // Initial load effect - only run once after mount
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      // Don't fetch on first mount as we already have initial items
    }
  }, []);

  // Effect to refresh products every 2 minutes
  useEffect(() => {
    // Set up interval for refreshing every 2 minutes
    const intervalId = setInterval(fetchLatestProducts, 2 * 60 * 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchLatestProducts]);

  // Effect to check for products when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLatestProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchLatestProducts]);

  // Make sure we always have items to display
  const displayItems = items.length > 0 ? items : initialItems;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-3xl">{title}</h3>
        <div className="hidden md:flex gap-x-4">
          <button 
            onClick={scrollPrev}
            className="p-2 rounded-full bg-white border hover:bg-gray-100"
            disabled={isLoading}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={scrollNext}
            className="p-2 rounded-full bg-white border hover:bg-gray-100"
            disabled={isLoading}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {displayItems.length === 0 && <NoResults />}
      
      <div className="overflow-hidden relative" ref={emblaRef}>
        <div className="flex h-full">
          {displayItems.map((item) => (
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