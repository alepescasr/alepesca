"use client";

import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  linkUrl: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageUrl, linkUrl }) => {
  return (
    <Link href={linkUrl} className="block relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-lighter">
      <div className="h-80 w-full relative">
        <Image 
          src={imageUrl} 
          alt={`${title} categoría`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center pb-6">
          <h2 className="text-white text-2xl md:text-3xl font-bold tracking-wider">{title}</h2>
        </div>
      </div>
    </Link>
  );
};

const CategoryCards = () => {
  const categories = [
    {
      title: "PESCA",
      imageUrl: "https://images.unsplash.com/photo-1516962126636-27ad087061cc?q=80&w=1074&auto=format&fit=crop",
      linkUrl: "/category/pesca"
    },
    {
      title: "CAMPING",
      imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1170&auto=format&fit=crop",
      linkUrl: "/category/camping"
    },
    {
      title: "INDUMENTARIA",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP0KnkNh1kHIebvWAoMAX3UJEeujwupQ18vg&s",
      linkUrl: "/category/indumentaria"
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            imageUrl={category.imageUrl}
            linkUrl={category.linkUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryCards; 