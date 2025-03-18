"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("query") || "");
  const debouncedValue = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedValue) {
      router.push(`/search?query=${encodeURIComponent(debouncedValue)}`);
    } else if (debouncedValue === "") {
      router.push(window.location.pathname);
    }
  }, [debouncedValue, router]);

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, descripción, color, peso..."
          className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/90 backdrop-blur-sm"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
    </div>
  );
};

export default SearchBar; 