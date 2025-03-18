import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";
import getProducts from "@/actions/get-products";
import SearchBar from "@/components/ui/search-bar";
import Billboard from "@/components/ui/billboard";

interface SearchPageProps {
  searchParams: {
    query?: string;
  }
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const products = await getProducts({});
  
  const filteredProducts = products.filter(product => {
    const searchQuery = searchParams.query?.toLowerCase() || "";
    return (
      product.name.toLowerCase().includes(searchQuery) ||
      product.description?.toLowerCase().includes(searchQuery) ||
      product.category?.name.toLowerCase().includes(searchQuery) ||
      product.color?.name.toLowerCase().includes(searchQuery) ||
      product.weight?.toString().includes(searchQuery) ||
      product.provider?.name.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <Container>
      <Billboard 
        data={{
          id: "search",
          label: "Búsqueda de Productos",
          imageUrl: "https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=1074&auto=format&fit=crop"
        }}
      />
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <SearchBar />
        <div className="mt-6">
          {filteredProducts.length === 0 ? (
            <NoResults />
          ) : (
            <>
              <p className="text-gray-500 mb-4">
                Se encontraron {filteredProducts.length} productos
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default SearchPage; 