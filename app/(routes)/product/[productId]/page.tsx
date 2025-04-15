import Container from "@/components/ui/container";
import ProductList from "@/components/product-list";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";

// Forzar comportamiento dinámico, sin caché
export const dynamic = "force-dynamic";
export const revalidate = 0; // No utilizar caché

export async function generateStaticParams() {
  const products = await getProducts({});

  return products.map((product) => ({
    productId: product.id,
  }));
}

interface ProductPageProps {
  params: {
    productId: string;
  };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  try {
    const product = await getProduct(params.productId);
    const relatedProducts = await getProducts({
      categoryId: product.category.id,
    });

    return (
      <div className="bg-primary-lighter/30">
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              <Gallery images={product.images} />
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <Info data={product} />
              </div>
            </div>
            <hr className="my-10" />
            <ProductList
              title="Productos Relacionados"
              items={relatedProducts}
            />
          </div>
        </Container>
      </div>
    );
  } catch (error) {
    console.error("Error al cargar el producto:", error);
    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Error al cargar el producto
              </h2>
              <p className="mt-2 text-gray-600">
                Por favor, intente nuevamente más tarde.
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }
};

export default ProductPage;
