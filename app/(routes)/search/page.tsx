'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";
import Billboard from "@/components/ui/billboard";
import axios from "axios";
import { Product } from '@/types';
import { Search as SearchIcon, X } from 'lucide-react';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  // Efecto para buscar productos cuando cambia la consulta
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const allProductsData = response.data;
        setAllProducts(allProductsData);
        
        // Filtramos localmente
        const queryLower = query.toLowerCase();
        const filteredProducts = allProductsData.filter((product: Product) => {
          const matchesName = product.name?.toLowerCase().includes(queryLower) || false;
          const matchesDescription = product.description?.toLowerCase().includes(queryLower) || false;
          const matchesColor = product.color?.name?.toLowerCase().includes(queryLower) || false;
          const matchesPrice = product.price?.toString().includes(queryLower) || false;
          const matchesOfferPrice = product.offerPrice?.toString().includes(queryLower) || false;

          return matchesName || matchesDescription || matchesColor || matchesPrice || matchesOfferPrice;
        });
        
        setProducts(filteredProducts);
        setSuggestions(filteredProducts.slice(0, 5));
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setProducts([]);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    } else {
      setProducts([]);
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [query]);

  // Manejar la búsqueda local
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Actualizar la URL con el nuevo término de búsqueda
    const url = new URL(window.location.href);
    url.searchParams.set('query', searchTerm);
    window.history.pushState({}, '', url.toString());
    
    // Filtrar productos localmente
    const termLower = searchTerm.toLowerCase();
    const filtered = allProducts.filter((product) => {
      const matchesName = product.name?.toLowerCase().includes(termLower) || false;
      const matchesDescription = product.description?.toLowerCase().includes(termLower) || false;
      const matchesColor = product.color?.name?.toLowerCase().includes(termLower) || false;
      const matchesPrice = product.price?.toString().includes(termLower) || false;
      const matchesOfferPrice = product.offerPrice?.toString().includes(termLower) || false;

      return matchesName || matchesDescription || matchesColor || matchesPrice || matchesOfferPrice;
    });
    
    setProducts(filtered);
    setSuggestions(filtered.slice(0, 5));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleViewAllProducts = () => {
    setShowSuggestions(false);
    setProducts(allProducts);
  };

  return (
    <div className="bg-white">
      <Container>
        <Billboard
          data={{
            id: "search",
            label: query ? `Resultados para: ${query}` : "Búsqueda de Productos",
            imageUrl:
              "https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=1074&auto=format&fit=crop",
          }}
        />
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          {/* Buscador en la página de resultados */}
          <div className="w-full max-w-xl mx-auto mt-6">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-3 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-md hover:bg-primary/90"
                  >
                    <SearchIcon className="h-5 w-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleViewAllProducts}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 whitespace-nowrap"
                >
                  Ver todos
                </button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setSearchTerm(product.name);
                        handleSearch(new Event('submit') as any);
                      }}
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
                </div>
              )}
            </form>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-500">Buscando productos...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <NoResults />
            ) : (
              <>
                <p className="text-gray-500 mb-4">
                  Se encontraron {products.length} productos{query ? ` para "${query}"` : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((item) => (
                    <ProductCard key={item.id} data={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SearchPage;