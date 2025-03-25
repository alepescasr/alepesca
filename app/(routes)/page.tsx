import WorkingProgress from "@/components/working-progress";

// Comentar todo el contenido original para mantenerlo como referencia
/*
import Billboard from "@/components/ui/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";
import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
*/

export const revalidate = 0;

const HomePage = async () => {
  // Comentar la obtención de datos original
  /*
  const billboard = await getBillboard("2");
  const products = await getProducts({ isFeatured: true });
  */

  return (
    <WorkingProgress />
    /*
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboard} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Productos Destacados" items={products} />
        </div>
      </div>
    </Container>
    */
  );
};

export default HomePage;
