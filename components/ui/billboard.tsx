"use client";

import Image from "next/image";
import type { Billboard } from "@/types";
import { useState, useEffect } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BillboardProps {
  data: Billboard;
  showControls?: boolean;
}

const Billboard: React.FC<BillboardProps> = ({
  data,
  showControls = false
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30
  });

  useEffect(() => {
    if (emblaApi && data.images && data.images.length > 1) {
      const autoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, 5000);

      return () => clearInterval(autoplay);
    }
  }, [emblaApi, data.images]);

  // Si no hay imágenes múltiples, usa la imageUrl tradicional
  if (!data.images || data.images.length === 0) {
    return (
      <div className="relative overflow-hidden">
        <div className="relative aspect-square md:aspect-[3.5/1] overflow-hidden">
          <Image
            src={data.imageUrl || '/placeholder.png'}
            alt={data.label}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center gap-y-8">
            <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs text-white">
              {data.label}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {data.images.map((image, index) => (
            <div 
              key={index}
              className="flex-[0_0_100%] min-w-0 relative aspect-square md:aspect-[3.5/1] overflow-hidden"
            >
              <Image
                src={image.url || '/placeholder.png'}
                alt={image.alt || data.label}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center gap-y-8">
                <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs text-white">
                  {data.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showControls && data.images.length > 1 && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default Billboard;
