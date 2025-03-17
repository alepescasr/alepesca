import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const HomePage: React.FC = async () => {
  const products = await getProducts({ isFeatured: true });
/*   const billboard = await getBillboard("0e12e5cf-29ab-4529-b8d5-c5371dae1f7b") || null;
 */
  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard 
          data={{
            id: "1",
            label: "Productos de Pesca Deportiva",
            imageUrl: "https://plus.unsplash.com/premium_photo-1661762422433-b18f87b64341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }}
        />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8 bg-primary-lightest/60 py-8 rounded-xl">
          <ProductList title="Destacados" items={products} />
        </div>
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8 bg-primary-lightest/60 py-8 rounded-xl">
          <ProductList title="Ofertas" items={products} />
        </div>
      </div>
    </Container>
  )
};

export default HomePage;
