"use client";

import NextImage from "next/image";
import { Tab } from "@headlessui/react";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

import { Image } from "@/types";
import GalleryTab from "./gallery-tab";

interface GalleryProps {
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
  const [processedImages, setProcessedImages] = useState<Image[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start"
  });

  // Autoplay para el slider móvil
  useEffect(() => {
    if (!emblaApi || processedImages.length <= 1) return;

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000); // Cambiar imagen cada 3 segundos

    // Limpiar el intervalo cuando el componente se desmonte o cuando cambie la categoría
    return () => clearInterval(autoplay);
  }, [emblaApi, processedImages.length]);

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

  useEffect(() => {
    const timestamp = new Date().getTime();
    const updatedImages = images.map((image) => ({
      ...image,
      url: `${image.url}${image.url.includes("?") ? "&" : "?"}t=${timestamp}`,
    }));
    setProcessedImages(updatedImages);
  }, [images]);

  // Si solo hay una imagen, mostrar sin controles
  if (processedImages.length <= 1) {
    return (
      <div className="aspect-square w-full">
        <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
          <NextImage
            fill
            src={processedImages[0]?.url || "/images/placeholder.jpg"}
            alt="Image"
            className="object-cover object-center"
            unoptimized={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse">
      {/* Versión móvil con slider */}
      <div className="relative sm:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {processedImages.map((image) => (
              <div key={image.id} className="flex-[0_0_100%] min-w-0">
                <div className="aspect-square relative h-full w-full overflow-hidden">
                  <NextImage
                    fill
                    src={image.url}
                    alt="Image"
                    className="object-cover object-center"
                    unoptimized={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Botones de navegación */}
        {canScrollPrev && (
          <Button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-primary-lighter/80 text-primary hover:bg-primary-lighter "
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {canScrollNext && (
          <Button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-lighter/80 text-primary hover:bg-primary-lighter "
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        {/* Indicadores de posición */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {processedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 border-[1px] ${
                selectedIndex === index
                  ? 'bg-primary-lighter border-primary'
                  : 'bg-white border-primary-lighter'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Versión desktop con pestañas */}
      <Tab.Group as="div" className="hidden sm:flex sm:flex-col-reverse">
        <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
          <Tab.List className="grid grid-cols-4 gap-6">
            {processedImages.map((image) => (
              <GalleryTab key={image.id} image={image} />
            ))}
          </Tab.List>
        </div>
        <Tab.Panels className="aspect-square w-full">
          {processedImages.map((image) => (
            <Tab.Panel key={image.id}>
              <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
                <NextImage
                  fill
                  src={image.url}
                  alt="Image"
                  className="object-cover object-center"
                  unoptimized={true}
                />
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Gallery;
