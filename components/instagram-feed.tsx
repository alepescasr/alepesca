"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { InstagramPost } from "@/types/instagram";
import getInstagram from "@/actions/get-instagram";
import useEmblaCarousel from "embla-carousel-react";

const InstagramHeader = () => (
  <div className="flex items-center justify-between mb-8 mx-4">
    <h2 className="text-2xl md:text-3xl font-bold">Síguenos en Instagram</h2>
    <Link
      href="https://www.instagram.com/alepescasr"
      target="_blank"
      className="flex items-center gap-2 text-primary hover:text-primary-dark hover:underline hover:scale-125 transition-all duration-500"
    >
      <Instagram className="w-6 h-6" />
      <span>@alepescasr</span>
    </Link>
  </div>
);

const InstagramFeed = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
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

  // Autoplay para el carrusel
  useEffect(() => {
    if (!emblaApi || posts.length <= 1) return;

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(autoplay);
  }, [emblaApi, posts]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const instagramData = await getInstagram();
        
        // Ordenar por fecha de creación (más recientes primero)
        const sortedPosts = instagramData.sort(
          (a: InstagramPost, b: InstagramPost) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Tomar solo los últimos 3 posts
        setPosts(sortedPosts.slice(0, 3));
      } catch (error) {
        console.error("Error fetching Instagram posts:", error);
        setError(
          error instanceof Error ? error.message : "Error al cargar los posts"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-8 bg-primary-lighter rounded-lg">
        <div className="container mx-auto px-4 bg-primary-lighter rounded-lg">
          <InstagramHeader />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative aspect-square bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-8 bg-primary-lighter rounded-lg">
        <div className="container mx-auto px-4">
          <InstagramHeader />
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="w-full py-8 bg-primary-lighter rounded-lg">
        <div className="container mx-auto px-4">
          <InstagramHeader />
          <div className="text-center py-8">
            <p className="text-gray-500">No hay posts disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 bg-primary-lighter rounded-lg">
      <div className="container mx-auto px-4">
        <InstagramHeader />
        {/* Grid para desktop, carrusel para móvil */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={post.imageUrl}
                alt={post.description || "Post de Instagram"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-center p-4 text-sm line-clamp-3">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {/* Carrusel para móvil */}
        <div className="md:hidden relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {posts.map((post) => (
                <div key={post.id} className="flex-[0_0_100%] min-w-0 px-2">
                  <Link
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-lg block"
                  >
                    <Image
                      src={post.imageUrl}
                      alt={post.description || "Post de Instagram"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <p className="text-white text-center p-4 text-sm line-clamp-3">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {/* Indicadores de posición */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {posts.map((_, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default InstagramFeed;
