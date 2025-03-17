import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";
import getProducts from "@/actions/get-products";
import SearchBar from "@/components/ui/search-bar";

interface SearchPageProps {
  searchParams: {
    query?: string;
  }
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const products = await getProducts({});
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchParams.query?.toLowerCase() || "") ||
    product.description?.toLowerCase().includes(searchParams.query?.toLowerCase() || "")
  );

  return (
    <Container>
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <SearchBar />
        <div className="mt-6">
          {filteredProducts.length === 0 && <NoResults />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} data={item} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SearchPage; 