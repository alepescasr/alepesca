'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Product } from '@/types';
import axios from 'axios';

const MobileSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

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
  }, [allProducts]);

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
    window.location.href = `/product/${product.id}`;
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
  };

  const handleViewAllProducts = () => {
    setShowSuggestions(false);
    window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
  };

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
        <div className="lg:hidden absolute left-0 right-0 top-0 h-16 bg-primary px-4 flex items-center">
          <form onSubmit={handleSearch} className="relative w-full">
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
                        <span className="font-medium">{product.name}</span>
                        <div className="text-xs text-gray-500">
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
          <button
            onClick={() => setIsOpen(false)}
            className="ml-4 p-2 text-white hover:text-primary-lighter transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default MobileSearch; 