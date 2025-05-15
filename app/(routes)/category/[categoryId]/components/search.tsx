'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';

interface SearchProps {
  products: Product[];
  onSearch: (results: Product[]) => void;
  clearSearchTerm?: boolean;
}

const Search: React.FC<SearchProps> = ({ products, onSearch, clearSearchTerm }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Efecto para limpiar el input cuando clearSearchTerm cambia
  useEffect(() => {
    if (clearSearchTerm) {
      setSearchTerm('');
      setSuggestions([]);
      setFilteredResults([]);
      setShowSuggestions(false);
    }
  }, [clearSearchTerm]);

  // Efecto para manejar clics fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Función para filtrar productos
  const filterProducts = useCallback((term: string) => {
    if (!term.trim()) {
      setSuggestions([]);
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
    // Guardar resultados filtrados en el estado local
    setFilteredResults(filtered);
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
    const searchValue = product.name;
    filterProducts(searchValue);
    setShowSuggestions(false);
    // Limpiar el input después de un breve delay
    setTimeout(() => {
      setSearchTerm('');
      setSuggestions([]);
    }, 300);
    router.push(`/product/${product.id}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    // No limpiamos filteredResults para mantener los resultados
  };

  // Función para manejar la búsqueda al presionar Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      filterProducts(searchTerm);
      setShowSuggestions(false);
      // Limpiar el input después de un breve delay
      setTimeout(() => {
        setSearchTerm('');
        setSuggestions([]);
      }, 300);
    }
  };

  // Efecto para mantener los resultados filtrados cuando se limpia el input
  useEffect(() => {
    if (!searchTerm.trim() && filteredResults.length > 0) {
      onSearch(filteredResults);
    }
  }, [searchTerm, filteredResults, onSearch]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            const newValue = e.target.value;
            setSearchTerm(newValue);
            setShowSuggestions(newValue.length > 0);
            if (!newValue.trim()) {
              setSuggestions([]);
            }
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(searchTerm.length > 0)}
          placeholder="Buscar productos..."
          className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
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