import Container from '@/components/ui/container';
import CategoryContent from './components/category-content';

import getProducts from "@/actions/get-products";
import getColors from '@/actions/get-colors';
import getCategories from '@/actions/get-categories';
import axios from 'axios';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: {
    categoryId: string;
  }
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ 
  params 
}) => {
  try {
    const categories = await getCategories();
    // Convertimos el slug de la URL a un formato comparable con el nombre
    const categoryName = params.categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const category = categories.find((item) => 
      item.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (!category) {
      console.error('Categoría no encontrada:', categoryName);
      return (
        <div className="bg-primary-lighter/30">
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

    // Obtener subcategorías de la categoría actual
    const subcategoriesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subcategories`);
    const allSubcategories = subcategoriesResponse.data;
    
    // Filtrar subcategorías que pertenecen a la categoría actual
    const categorySubcategories = allSubcategories.filter(
      (subcategory: any) => subcategory.categoryId === category.id
    );

    // Obtener productos y colores
    const [products, colors] = await Promise.all([
      getProducts({ categoryId: category.id }),
      getColors()
    ]);

    // Filtrar subcategorías que tienen productos
    const subcategoriesWithProducts = categorySubcategories.filter((subcategory: any) => 
      products.some(product => product.subcategoryId === subcategory.id)
    );

    const billboardData = {
      id: category.id,
      label: category.name,
      imageUrl: category.imageUrl
    };

    return (
      <div className="bg-primary-lighter/30">
        <Container>
          <CategoryContent 
            products={products}
            colors={colors}
            billboardData={billboardData}
            subcategories={subcategoriesWithProducts}
            categoryId={params.categoryId}
          />
        </Container>
      </div>
    );
  } catch (error) {
    console.error('Error al cargar la página de categoría:', error);
    return (
      <div className="bg-primary-lighter/30">
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