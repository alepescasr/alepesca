"use client";

import NextImage from "next/image";
import { Tab } from "@headlessui/react";
import { useEffect, useState } from "react";

import { Image } from "@/types";

import GalleryTab from "./gallery-tab";

interface GalleryProps {
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
  // Añadir timestamp para evitar caché en las imágenes
  const [processedImages, setProcessedImages] = useState<Image[]>([]);

  useEffect(() => {
    const timestamp = new Date().getTime();
    const updatedImages = images.map((image) => ({
      ...image,
      url: `${image.url}${image.url.includes("?") ? "&" : "?"}t=${timestamp}`,
    }));
    setProcessedImages(updatedImages);
  }, [images]);

  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
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
                unoptimized={true} // Desactivar optimización de Next.js para evitar caché
              />
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Gallery;
