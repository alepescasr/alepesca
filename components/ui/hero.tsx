"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface HeroProps {
  data: Banner[];
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    setSelectedIndex(emblaApi.selectedScrollSnap());
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
    if (!emblaApi || data.length <= 1) return;

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 7000);

    return () => clearInterval(autoplay);
  }, [emblaApi, data]);

  // Si no hay datos, mostrar una imagen por defecto
  if (!data || data.length === 0) {
    return (
      <div className="relative w-full h-[400px] overflow-hidden">
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

  // Si solo hay una imagen
  if (data.length === 1) {
    return (
      <div className="relative w-full h-[400px] overflow-hidden">
        <Image
          src={data[0].imageUrl}
          alt={data[0].title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-primary-lighter/90"></div>
      </div>
    );
  }

  // Renderizar carrusel para múltiples imágenes
  return (
    <div className="relative w-full h-[250px] md:h-[400px] lg:h-[400px] xl:h-[400px] overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {data.map((banner) => (
            <div
              key={banner.id}
              className="flex-[0_0_100%] min-w-0 relative h-[250px] md:h-[400px] lg:h-[400px] xl:h-[400px]"
            >
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="md:object-cover lg:object-cover xl:object-cover"
                priority={banner.order === 1}
              />
            </div>
          ))}
        </div>
      </div>
      {canScrollPrev && (
        <Button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary-lighter/80 text-primary hover:bg-white hidden sm:flex"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-6 stroke-[3] text-primary" />
        </Button>
      )}
      {canScrollNext && (
        <Button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary-lighter/80 text-primary hover:bg-white hidden sm:flex"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-6 stroke-[3] text-primary" />
        </Button>
      )}
      {/* Indicadores de posición */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
              selectedIndex === index
                ? 'bg-primary-lighter/80 border-white'
                : 'bg-white border-primary-lighter/80'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-primary-lighter/90"></div>
    </div>
  );
};

export default Hero;
