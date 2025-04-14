// Comentar todo el contenido original para mantenerlo como referencia
import CategoryCards from "@/components/category-cards";
import Hero from "@/components/ui/hero";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";
import getBanners from "@/actions/get-banners";
import getProducts from "@/actions/get-products";
import InstagramFeed from "@/components/instagram-feed";
import BrandSlider from "@/components/brand-slider";

/* export const revalidate = 0; */

const HomePage = async () => {
  const [banners, featuredProducts, offerProducts] = await Promise.all([
    getBanners(),
    getProducts({ isFeatured: true }),
    getProducts({ hasOffer: true })
  ]);

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Hero data={banners} />
        <div className="flex flex-col mt-auto mb-3 px-4 sm:px-6 lg:px-8">
          <BrandSlider/>
        </div>
        {/* Categorias */}
        <div className="flex flex-col mt-auto px-4 sm:px-6 lg:px-8">
          <CategoryCards />
        </div>
        
        {/* Productos Destacados */}
        {featuredProducts.length > 0 && (
          <div className="flex flex-col rounded-xl gap-y-8 p-4 sm:p-6 lg:p-8 m-8 bg-primary-lighter">
            <ProductList title="Productos Destacados" items={featuredProducts} />
          </div>
        )}

        {/* Productos con Ofertas */}
        {offerProducts.length > 0 && (
          <div className="flex flex-col rounded-xl gap-y-8 p-4 sm:p-6 lg:p-8 m-8 bg-primary-lighter">
            <ProductList title="Ofertas Especiales" items={offerProducts} />
          </div>
        )}

        {/* Instagram Feed */}
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Últimos Posts de Instagram</h2>
          <InstagramFeed />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
