'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const NavbarSearch = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Cargar todos los productos al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        setAllProducts(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    fetchProducts();
  }, []);

  // Función para filtrar productos
  const filterProducts = useCallback((term: string) => {
    if (!term.trim()) {
      setSuggestions([]);
      return;
    }

    const termLower = term.toLowerCase();
    const filtered = allProducts.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(termLower);
      const matchesDescription = product.description?.toLowerCase().includes(termLower) || false;
      const matchesColor = product.color?.name.toLowerCase().includes(termLower) || false;
      const matchesPrice = product.price.toString().includes(termLower);
      const matchesOfferPrice = product.offerPrice?.toString().includes(termLower) || false;

      return matchesName || matchesDescription || matchesColor || matchesPrice || matchesOfferPrice;
    });

    setSuggestions(filtered.slice(0, 5));
    setFilteredResults(filtered);
  }, [allProducts]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      filterProducts(searchTerm);
      setShowSuggestions(false);
      // Limpiar el input después de un breve delay
      setTimeout(() => {
        setSearchTerm('');
        setSuggestions([]);
      }, 300);
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleViewAllResults = () => {
    if (searchTerm.trim()) {
      filterProducts(searchTerm);
      setShowSuggestions(false);
      // Limpiar el input después de un breve delay
      setTimeout(() => {
        setSearchTerm('');
        setSuggestions([]);
      }, 300);
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleShowAll = () => {
    setSearchTerm('');
    setSuggestions([]);
    setFilteredResults([]);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    // No limpiamos filteredResults para mantener los resultados
  };

  return (
    <div className="relative hidden lg:block w-[300px]" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            const newValue = e.target.value;
            setSearchTerm(newValue);
            // Solo mostramos sugerencias si hay texto
            setShowSuggestions(newValue.length > 0);
            // Si el input está vacío, limpiamos las sugerencias pero mantenemos los resultados
            if (!newValue.trim()) {
              setSuggestions([]);
            }
          }}
          onFocus={() => setShowSuggestions(searchTerm.length > 0)}
          placeholder="Buscar productos..."
          className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:text-primary-lighter text-primary"
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
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                {product.images?.[0]?.url && (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <div>
                  <span className="font-medium text-primary-lighter/90">{product.name}</span>
                  <div className="text-xs text-primary-lighter/90">
                    {product.category?.name} - {product.subcategory?.name}
                  </div>
                </div>
              </div>
            </button>
          ))}
          <button
            onClick={handleViewAllResults}
            className="block w-full px-4 py-2 text-center text-primary hover:bg-gray-100 font-medium"
          >
            Ver todos los productos
          </button>
        </div>
      )}

      {filteredResults.length > 0 && !showSuggestions && (
        <button
          onClick={handleShowAll}
          className="mt-2 w-full px-4 py-2 text-center text-primary hover:bg-gray-100 border border-gray-300 rounded-md shadow-sm font-medium transition-colors"
        >
          Mostrar todos los productos
        </button>
      )}
    </div>
  );
};

export default NavbarSearch;