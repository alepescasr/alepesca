"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { InstagramPost } from '@/types/instagram';

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://ciro-ecommerce-admin.vercel.app/api/posts');
        const data = await response.json();
        // Ordenar por fecha de creación y tomar los últimos 3
        const sortedPosts = data
          .sort((a: InstagramPost, b: InstagramPost) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-8 bg-primary-lighter rounded-lg">
        <div className="container mx-auto px-4">
          <InstagramHeader />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 bg-white">
        <div className="container mx-auto px-4">
          <InstagramHeader />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 bg-white">
      <div className="container mx-auto px-4">
        <InstagramHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={post.imageUrl}
                alt={post.description}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                  <p className="text-sm line-clamp-4">
                    {post.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstagramFeed; 