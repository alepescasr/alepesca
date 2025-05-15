'use client';

import { useState, useEffect } from 'react';
import Billboard from '@/components/ui/billboard';
import ProductCard from '@/components/ui/product-card';
import NoResults from '@/components/ui/no-results';
import Search from './search';
import { Product, Color } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

interface CategoryContentProps {
  products: Product[];
  colors: Color[];
  billboardData: {
    id: string;
    label: string;
    imageUrl: string;
  };
  subcategories: Subcategory[];
  categoryId: string;
}

const CategoryContent: React.FC<CategoryContentProps> = ({
  products,
  colors,
  billboardData,
  subcategories,
  categoryId
}) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("default");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [clearSearch, setClearSearch] = useState(false);

  // Cargar los filtros guardados cuando cambia la categoría
  useEffect(() => {
    const savedSubcats = localStorage.getItem(`categorySubcats-${categoryId}`);
    const savedSortOrder = localStorage.getItem(`categorySortOrder-${categoryId}`);
    
    if (savedSubcats) {
      setSelectedSubcategories(JSON.parse(savedSubcats));
    } else {
      setSelectedSubcategories([]);
    }
    
    if (savedSortOrder) {
      setSortOrder(savedSortOrder);
    } else {
      setSortOrder("default");
    }
    
    setSearchResults([]);
  }, [categoryId]);

  // Efecto para aplicar filtros cuando cambian los productos o los filtros
  useEffect(() => {
    const sourceProducts = searchResults.length > 0 ? searchResults : products;
    let result = [...sourceProducts];
    
    // Aplicar filtro de subcategorías
    if (selectedSubcategories.length > 0) {
      result = result.filter(product => {
        return product.subcategory && selectedSubcategories.includes(product.subcategory.name);
      });
    }
    
    // Aplicar ordenamiento
    if (sortOrder !== 'default') {
      result.sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }
    
    setFilteredProducts(result);
  }, [products, searchResults, selectedSubcategories, sortOrder]);

  // Guardar los filtros en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem(`categorySubcats-${categoryId}`, JSON.stringify(selectedSubcategories));
  }, [selectedSubcategories, categoryId]);

  useEffect(() => {
    localStorage.setItem(`categorySortOrder-${categoryId}`, sortOrder);
  }, [sortOrder, categoryId]);

  const handleSubcategorySelect = (subcategory: string) => {
    if (!selectedSubcategories.includes(subcategory)) {
      const newSubcats = [...selectedSubcategories, subcategory];
      setSelectedSubcategories(newSubcats);
    }
  };

  const handleSortSelect = (order: string) => {
    setSortOrder(order);
  };

  const removeFilter = (filterToRemove: string) => {
    if (subcategories.some(s => s.name === filterToRemove)) {
      const newSubcats = selectedSubcategories.filter(f => f !== filterToRemove);
      setSelectedSubcategories(newSubcats);
    } else if (filterToRemove.includes('Precio')) {
      setSortOrder("default");
    }
  };

  const handleSearch = (results: Product[]) => {
    setSearchResults(results);
  };

  const handleShowAll = () => {
    setSearchResults([]);
    setSelectedSubcategories([]);
    setSortOrder("default");
    setFilteredProducts(products);
    setClearSearch(true);
    // Resetear el estado de limpieza después de un breve delay
    setTimeout(() => {
      setClearSearch(false);
    }, 100);
  };

  return (
    <div className="bg-primary-lighter/30">
      <Billboard data={billboardData} />
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mt-6">
          <div className="mb-2 flex justify-center gap-6">
            <div className="w-[60%] max-w-[600px]">
              <Search 
                products={products} 
                onSearch={handleSearch} 
                clearSearchTerm={clearSearch}
              />
            </div>
            <div className="w-auto">
              <Select
                onValueChange={(value) => {
                  const [type, order] = value.split('-');
                  if (type === 'all') {
                    handleSortSelect(order);
                  } else {
                    handleSubcategorySelect(type);
                  }
                }}
              >
                <SelectTrigger className="h-10 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filtro</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="all-desc">Precio: Mayor a Menor</SelectItem>
                  {subcategories.length > 0 && (
                    <>
                      <SelectItem value="all-default" disabled>──────────</SelectItem>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={`${subcategory.name}-default`}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botón Mostrar todos los productos */}
          {(searchResults.length > 0 || selectedSubcategories.length > 0 || sortOrder !== 'default') && (
            <div className="flex justify-center mb-4">
              <button
                onClick={handleShowAll}
                className="w-[60%] max-w-[600px] px-4 py-2 text-center text-primary hover:bg-gray-100 border-2 border-gray-300 rounded-md shadow-sm font-medium transition-colors sm:rounded-lg"
              >
                Mostrar todos los productos
              </button>
            </div>
          )}
          
          {/* Barra de filtros activos */}
          {(selectedSubcategories.length > 0 || sortOrder !== 'default') && (
            <div className="mr-2 mb-4 flex flex-wrap gap-2">
              {selectedSubcategories.map((subcategory) => (
                <div
                  key={subcategory}
                  className="flex items-center gap-2 bg-primary-light text-white px-3 py-1 rounded-full text-sm"
                >
                  <span>{subcategory}</span>
                  <button
                    onClick={() => removeFilter(subcategory)}
                    className="hover:bg-white/20 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {sortOrder !== 'default' && (
                <div
                  className="flex items-center gap-2 bg-primary-light text-white px-3 py-1 rounded-full text-sm"
                >
                  <span>{sortOrder === 'asc' ? 'Precio: Menor a Mayor' : 'Precio: Mayor a Menor'}</span>
                  <button
                    onClick={() => removeFilter(sortOrder === 'asc' ? 'Precio: Menor a Mayor' : 'Precio: Mayor a Menor')}
                    className="hover:bg-white/20 rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {filteredProducts.length === 0 && <NoResults />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} data={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryContent; 