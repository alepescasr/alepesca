'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';

interface SearchProps {
  products: Product[];
  onSearch: (results: Product[]) => void;
}

const Search: React.FC<SearchProps> = ({ products, onSearch }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  // Función para filtrar productos
  const filterProducts = useCallback((term: string) => {
    if (!term.trim()) {
      setSuggestions([]);
      onSearch([]);
      return;
    }

    const termLower = term.toLowerCase();
    const filtered = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(termLower);
      const matchesDescription = product.description?.toLowerCase().includes(termLower) || false;
      const matchesColor = product.color?.name.toLowerCase().includes(termLower) || false;
      const matchesPrice = product.price.toString().includes(termLower);
      const matchesOfferPrice = product.offerPrice?.toString().includes(termLower) || false;

      return matchesName || matchesDescription || matchesColor || matchesPrice || matchesOfferPrice;
    });

    // Actualizar sugerencias (máximo 5)
    setSuggestions(filtered.slice(0, 5));
    // Actualizar resultados de búsqueda
    onSearch(filtered);
  }, [products, onSearch]);

  // Efecto para filtrar cuando cambia el término de búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterProducts(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterProducts]);

  const handleSuggestionClick = (product: Product) => {
    setSearchTerm(product.name);
    filterProducts(product.name);
    setShowSuggestions(false);
    // Usar window.location en lugar de router.push
    router.push(`/product/${product.id}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    onSearch([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Buscar productos..."
          className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <span className="font-medium">{product.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search; 