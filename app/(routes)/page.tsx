// Comentar todo el contenido original para mantenerlo como referencia
import CategoryCards from "@/components/category-cards";
import Billboard from "@/components/ui/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";
import getBillboard from "@/actions/get-billboard"; 
import getProducts from "@/actions/get-products";
import InstagramFeed from "@/components/instagram-feed";

/* export const revalidate = 0; */

const HomePage = async () => {
  // Comentar la obtención de datos original
  let billboard = await getBillboard("1");
  if (!billboard) {
    billboard = {
      id: "1",
      label: "Default Billboard",
      imageUrl: "/prueba.jpg",
    };
  } 
  
  // Obtener productos destacados y con ofertas
  const [featuredProducts, offerProducts] = await Promise.all([
    getProducts({ isFeatured: true }),
    getProducts({ hasOffer: true })
  ]);

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboard} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <CategoryCards />
        </div>
        
        {/* Productos Destacados */}
        {featuredProducts.length > 0 && (
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <ProductList title="Productos Destacados" items={featuredProducts} />
          </div>
        )}

        {/* Productos con Ofertas */}
        {offerProducts.length > 0 && (
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
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
