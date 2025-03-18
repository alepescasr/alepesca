import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import SearchBar from "@/components/ui/search-bar";
import BrandSlider from "@/components/brand-slider";

export const revalidate = 0;

const HomePage = async () => {
  const allProducts = await getProducts({});
  const featuredProducts = allProducts.filter(product => product.isFeatured);
  const offerProducts = allProducts.filter(product => product.hasOffer);

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <div className="relative">
          <Billboard 
            data={{
              id: "1",
              label: "Productos de Pesca Deportiva",
              imageUrl: "https://www.losreyunossanrafael.com/assets/img/slide1.jpg"
            }}
          />
          <div className="absolute -bottom-5 left-0 right-0">
            <SearchBar />
          </div>
        </div>
        <BrandSlider />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8 bg-primary-lighter/70 py-8 rounded-xl mt-8">
          <ProductList title="Destacados" items={featuredProducts} />
        </div>
        {offerProducts.length > 0 && (
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8 bg-primary-lighter/70 py-8 rounded-xl">
            <ProductList title="Ofertas" items={offerProducts} />
          </div>
        )}
      </div>
    </Container>
  )
};

export default HomePage;
