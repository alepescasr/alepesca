import { notFound } from "next/navigation";
import getCategory from "@/actions/get-category";
import getProducts from "@/actions/get-products";
import getCategories from "@/actions/get-categories";

import Container from "@/components/ui/container";
import Billboard from "@/components/ui/billboard";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";

import getColors from "@/actions/get-colors";

import Filter from "./components/filter";
import MobileFilters from "./components/mobile-filters";
import SearchBar from "@/components/ui/search-bar";

export const revalidate = 3600; // Revalidar cada hora

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((category) => ({
      categoryId: category.id
    }));
  } catch (error) {
    console.error("Error generando parámetros estáticos:", error);
    return [];
  }
}

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    colorId: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({
  params,
  searchParams,
}) => {
  const category = await getCategory(params.categoryId);

  // Si no se encuentra la categoría, redirigir a 404
  if (!category) {
    notFound();
  }

  const products = await getProducts({ 
    categoryId: params.categoryId,
    colorId: searchParams.colorId
  });
  console.log(products);
  const colors = await getColors();

  // Crear un objeto billboard usando la información de la categoría
  const billboardData = {
    id: category.id,
    label: category.name,
    imageUrl: category.imageUrl || '/placeholder.jpg', // Imagen por defecto si no hay imageUrl
  };

  return (
    <div className="bg-white">
      <Container>
        <div className="relative">
          <Billboard
            data={billboardData}
          />
          <div className="absolute -bottom-5 left-0 right-0">
            <SearchBar />
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 pb-24 mt-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            {/* <MobileFilters  colors={colors} /> */}
            <div className="hidden lg:block">
              <Filter valueKey="colorId" name="Colors" data={colors} />
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {products.length === 0 && <NoResults />}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
