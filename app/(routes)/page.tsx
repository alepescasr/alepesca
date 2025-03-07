import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const HomePage = async () => {
  const products = await getProducts({ isFeatured: true });
/*   const billboard = await getBillboard("0e12e5cf-29ab-4529-b8d5-c5371dae1f7b") || null;
 */
  return (
    <Container>
      <div className="space-y-10 pb-10">
      <Billboard 
          data={{
            id: "1",
            label: "Productos de Calidad",
            imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop"
          }}
        /> 
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" items={products} />
        </div>
        
      </div>
    </Container>
  )
};

export default HomePage;
