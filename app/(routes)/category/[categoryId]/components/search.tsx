'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { Product } from '@/types';

interface SearchProps {
  products: Product[];
  onSearch: (filteredProducts: Product[]) => void;
}

const Search: React.FC<SearchProps> = ({ products, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const searchProducts = useCallback(() => {
    if (!debouncedSearch.trim()) {
      onSearch(products);
      return;
    }

    const searchTermLower = debouncedSearch.toLowerCase();
    const filteredProducts = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTermLower) ||
        product.description.toLowerCase().includes(searchTermLower) ||
        product.color?.name.toLowerCase().includes(searchTermLower)
      );
    });

    onSearch(filteredProducts);
  }, [debouncedSearch, products, onSearch]);

  useEffect(() => {
    searchProducts();
  }, [searchProducts]);

  return (
    <div className="w-full max-w-md pt-3">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Buscar productos..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
    </div>
  );
};

export default Search; 