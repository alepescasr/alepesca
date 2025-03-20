"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';

const InstagramHeader = () => (
  <div className="flex items-center justify-between mb-8">
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
  const posts = [
    {
      id: '1',
      imageUrl: '/images/instagram/post1.jpg',
      caption: 'Descubrí los mejores lugares para pescar en San Rafael 🎣',
      link: 'https://www.instagram.com/p/DHCsYlBxEZs/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
    },
    {
      id: '2',
      imageUrl: '/images/instagram/post2.webp',
      caption: 'Nueva colección de equipos de pesca ya disponible! 🎣',
      link: 'https://www.instagram.com/p/DHbQPqtu6Qk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
    },
    {
      id: '3',
      imageUrl: '/images/instagram/post2.webp',
      caption: 'Tips para principiantes en la pesca deportiva 🎣',
      link: 'https://www.instagram.com/p/DHbQPqtu6Qk/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <InstagramHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.link}
            target="_blank"
            className="block group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="relative h-80 w-full">
              <Image
                src={post.imageUrl}
                alt="Instagram post"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm line-clamp-3">
                  {post.caption}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed; 