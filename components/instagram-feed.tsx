"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';

interface InstagramPost {
  id: string;
  media_url: string;
  caption: string;
  permalink: string;
}

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
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/instagram');
        if (!response.ok) {
          throw new Error('Error al cargar los posts de Instagram');
        }
        const data = await response.json();
        setPosts(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        setError('No se pudieron cargar los posts de Instagram');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <InstagramHeader />
      
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : !error && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.permalink}
              target="_blank"
              className="block group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-80 w-full">
                <Image
                  src={post.media_url}
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
      ) : null}
    </div>
  );
};

export default InstagramFeed; 