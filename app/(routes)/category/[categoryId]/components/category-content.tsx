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
}

const CategoryContent: React.FC<CategoryContentProps> = ({
  products,
  colors,
  billboardData,
  subcategories
}) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

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

  const handleSubcategorySelect = (subcategory: string) => {
    if (!selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };

  const handleSortSelect = (order: string) => {
    setSortOrder(order);
  };

  const removeFilter = (filterToRemove: string) => {
    if (subcategories.some(s => s.name === filterToRemove)) {
      setSelectedSubcategories(selectedSubcategories.filter(f => f !== filterToRemove));
    } else if (filterToRemove.includes('Precio')) {
      setSortOrder('default');
    }
  };

  const handleSearch = (results: Product[]) => {
    setSearchResults(results);
  };

  return (
    <div className="bg-primary-lighter/30">
      <Billboard data={billboardData} />
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mt-6">
          <div className="mb-6 flex flex-row gap-4 items-center">
            <div className="w-[75%] flex items-center">
              <Search products={products} onSearch={handleSearch} />
            </div>
            <div className="w-[20%] flex items-center">
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
                <SelectTrigger className="w-full h-10">
                  <div className="flex items-center justify-center w-full">
                    <Filter className="h-4 w-4" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-default">Todos los productos</SelectItem>
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
          
          {/* Barra de filtros activos */}
          {(selectedSubcategories.length > 0 || sortOrder !== 'default') && (
            <div className="mb-4 flex flex-wrap gap-2">
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