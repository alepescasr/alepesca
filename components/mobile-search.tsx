'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Product } from '@/types';
import axios from 'axios';

const MobileSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    fetchProducts();
  }, []);

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

    setSuggestions(filtered.slice(0, 3));
    setFilteredResults(filtered);
  }, [allProducts]);

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
    setTimeout(() => {
      setSearchTerm('');
      setSuggestions([]);
    }, 300);
    window.location.href = `/product/${product.id}`;
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    filterProducts(searchTerm);
    setShowSuggestions(false);
    setTimeout(() => {
      setSearchTerm('');
      setSuggestions([]);
    }, 300);
    window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
  };

  const handleViewAllProducts = () => {
    filterProducts(searchTerm);
    setShowSuggestions(false);
    setTimeout(() => {
      setSearchTerm('');
      setSuggestions([]);
    }, 300);
    window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
  };

  const handleShowAll = () => {
    setSearchTerm('');
    setSuggestions([]);
    setFilteredResults([]);
    setShowSuggestions(false);
  };

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

  return (
    <>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 text-white hover:text-primary-lighter transition-colors"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      ) : (
        <div className="lg:hidden absolute left-0 right-0 top-0 h-auto bg-primary px-4 flex flex-col items-center py-4" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative w-full">
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
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 pr-10 rounded-md border text-primary border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:text-primary-lighter focus:font-semibold"
                autoFocus
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
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
                        <span className="font-medium text-primary-lighter">{product.name}</span>
                        <div className="text-xs text-primary-lighter/90">
                          {product.category?.name} - {product.subcategory?.name}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                <button
                  onClick={handleViewAllProducts}
                  className="w-full px-4 py-2 text-left text-primary hover:bg-gray-100 focus:outline-none focus:bg-gray-100 border-t border-gray-200"
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </form>

          {filteredResults.length > 0 && !showSuggestions && (
            <button
              onClick={handleShowAll}
              className="w-full mt-2 px-4 py-2 text-center text-primary bg-white hover:bg-gray-100 border border-gray-300 rounded-md shadow-sm font-medium transition-colors"
            >
              Mostrar todos los productos
            </button>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 p-2 text-white hover:text-primary-lighter transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default MobileSearch; 