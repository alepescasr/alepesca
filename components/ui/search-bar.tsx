"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, KeyboardEvent } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import getProducts from "@/actions/get-products";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("query") || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedValue = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedValue.length > 0) {
        const products = await getProducts({});
        const filteredSuggestions = products
          .filter(product => 
            product.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
            product.description?.toLowerCase().includes(debouncedValue.toLowerCase()) ||
            product.category?.name.toLowerCase().includes(debouncedValue.toLowerCase())
          )
          .map(product => product.name)
          .slice(0, 5); // Limitamos a 5 sugerencias
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  const handleSearch = () => {
    if (searchQuery) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(window.location.pathname);
    }
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    router.push(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Buscar por nombre, descripción, categoría..."
          className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/90 backdrop-blur-sm"
        />
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer" 
          onClick={handleSearch}
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 