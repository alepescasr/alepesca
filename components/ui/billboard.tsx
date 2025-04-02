"use client";

import Image from "next/image";
import type { Billboard as BillboardType } from "@/types";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

interface BillboardProps {
  data: BillboardType | null;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay para múltiples imágenes
  useEffect(() => {
    if (!emblaApi || !data?.images || data.images.length <= 1) return;

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(autoplay);
  }, [emblaApi, data?.images]);

  // Si no hay datos, mostrar una imagen por defecto
  if (!data) {
    return (
      <div className="relative w-full h-[400px] overflow-hidden ">
        <Image
          src="/images/placeholder-billboard.jpg"
          alt="Imagen por defecto"
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  // Si no hay imágenes múltiples, usa la imageUrl tradicional
  if (!data.images || data.images.length === 0) {
    return (
      <div className="relative w-full h-[400px] overflow-hidden ">
        <Image
          src={data.imageUrl || '/images/placeholder-billboard.jpeg'}
          alt={data.label || 'Imagen por defecto'}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  // Renderizar carrusel para múltiples imágenes
  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {data.images.map((image, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative h-[400px]"
            >
              <Image
                src={image.url}
                alt={`${data.label} - Imagen ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
      {canScrollPrev && (
        <Button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {canScrollNext && (
        <Button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default Billboard;
