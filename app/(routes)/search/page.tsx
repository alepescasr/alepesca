import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";
import SearchBar from "@/components/ui/search-bar";
import Billboard from "@/components/ui/billboard";
import axios from "axios";

interface SearchPageProps {
  searchParams: {
    query: string;
  };
}

const SearchPage: React.FC<SearchPageProps> = async ({ searchParams }) => {
  if (!searchParams.query) {
    return null;
  }

  const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;
  try {
    const response = await axios.get(
      `${URL}/search?query=${encodeURIComponent(searchParams.query)}`
    );
    const products = response.data;

    return (
      <div className="bg-white">
        <Container>
          <Billboard
            data={{
              id: "search",
              label: "Búsqueda de Productos",
              imageUrl:
                "https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=1074&auto=format&fit=crop",
            }}
          />
          <div className="px-4 sm:px-6 lg:px-8 pb-24">
            <SearchBar />
            <div className="mt-6">
              {products.length === 0 ? (
                <NoResults />
              ) : (
                <>
                  <p className="text-gray-500 mb-4">
                    Se encontraron {products.length} productos
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((item: any) => (
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
  } catch (error) {
    console.error("Error al buscar productos:", error);

    return (
      <div className="bg-white">
        <Container>
          <Billboard
            data={{
              id: "search",
              label: "Búsqueda de Productos",
              imageUrl:
                "https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=1074&auto=format&fit=crop",
            }}
          />
          <div className="px-4 sm:px-6 lg:px-8 pb-24">
            <SearchBar />
            <div className="mt-6">
              <NoResults />
            </div>
          </div>
        </Container>
      </div>
    );
  }
};

export default SearchPage;
