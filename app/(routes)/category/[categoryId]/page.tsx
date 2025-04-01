import Container from '@/components/ui/container';
import Billboard from '@/components/ui/billboard';
import ProductCard from '@/components/ui/product-card';
import NoResults from '@/components/ui/no-results';

import getProducts from "@/actions/get-products";
import getCategory from '@/actions/get-category';
import getColors from '@/actions/get-colors';
import getCategories from '@/actions/get-categories';

import Filter from './components/filter';

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    categoryId: string; // Este será el nombre de la categoría
  }
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ 
  params 
}) => {
  try {
    console.log('Cargando categoría:', params.categoryId);
    
    const categories = await getCategories();
    // Buscamos la categoría por nombre (case insensitive)
    const category = categories.find((item) => 
      item.name.toLowerCase() === params.categoryId.toLowerCase()
    );
    
    if (!category) {
      console.error('Categoría no encontrada:', params.categoryId);
      return (
        <div className="bg-white">
          <Container>
            <div className="px-4 sm:px-6 lg:px-8 pb-24">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Categoría no encontrada</h2>
                <p className="mt-2 text-gray-600">La categoría que buscas no existe.</p>
              </div>
            </div>
          </Container>
        </div>
      );
    }

    console.log('Categoría encontrada:', category);
    
    const [products, colors] = await Promise.all([
      getProducts({ categoryId: category.id }),
      getColors()
    ]);

    // Crear el objeto billboard con la imagen de la categoría
    const billboardData = {
      id: category.id,
      label: category.name,
      imageUrl: category.imageUrl
    };

    return (
      <div className="bg-white">
        <Container>
          <Billboard data={billboardData} />
          <div className="px-4 sm:px-6 lg:px-8 pb-24">
            <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
              <div className="hidden lg:block">
                <Filter 
                  valueKey="colorId" 
                  name="Colores" 
                  data={colors}
                />
              </div>
              <div className="mt-6 lg:col-span-4 lg:mt-0">
                {products.length === 0 && <NoResults />}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
  } catch (error) {
    console.error('Error al cargar la página de categoría:', error);
    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 sm:px-6 lg:px-8 pb-24">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Error al cargar los productos</h2>
              <p className="mt-2 text-gray-600">Por favor, intente nuevamente más tarde.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }
};

export default CategoryPage;