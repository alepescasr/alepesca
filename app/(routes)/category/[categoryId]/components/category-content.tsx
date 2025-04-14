'use client';

import { useState } from 'react';
import Billboard from '@/components/ui/billboard';
import ProductCard from '@/components/ui/product-card';
import NoResults from '@/components/ui/no-results';
import Search from './search';
import Filter from './filter';
import { Product, Color } from '@/types';

interface CategoryContentProps {
  products: Product[];
  colors: Color[];
  billboardData: {
    id: string;
    label: string;
    imageUrl: string;
  };
}

const CategoryContent: React.FC<CategoryContentProps> = ({
  products,
  colors,
  billboardData
}) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  return (
    <div className="bg-primary-lighter">
      <Billboard data={billboardData} />
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
          <div className="hidden lg:block">
            <Filter 
              valueKey="colorId" 
              name="Colores" 
              data={colors}
            />
          </div>
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            <div className="mb-6">
              <Search products={products} onSearch={(filteredProducts) => {
                setFilteredProducts(filteredProducts);
              }} />
            </div>
            {filteredProducts.length === 0 && <NoResults />}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryContent; 