import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import getCategories from "@/actions/get-categories";
import FooterAccordion from './ui/footer-accordion';

const Footer = async () => {
  const categories = await getCategories();

  return (
    <footer className="bg-primary border-t">
      <div className="mx-auto py-10">
        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo y redes sociales */}
          <div className="w-full md:w-1/4 flex flex-col items-center mb-8 md:mb-0">
            <div className="w-40 h-20 relative mb-4 flex justify-center">
              <Image
                src="/images/logos/logo-1.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex gap-4 mt-2 justify-center">
              <Link 
                href="https://www.facebook.com/profile.php?id=100063559680935" 
                target="_blank"
                className="text-primary-lighter hover:text-accent transition-colors duration-300"
                aria-label="Facebook"
              >
                <div className="w-6 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              </Link>
              <Link 
                href="https://www.instagram.com/alepescasr" 
                target="_blank"
                className="text-primary-lighter hover:text-accent transition-colors duration-300"
                aria-label="Instagram"
              >
                <div className="w-6 h-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* Categorías - Desplegable en móvil */}
          <FooterAccordion 
            title="Categorías"
            className="w-full md:w-1/4 mb-6 md:mb-0"
          >
            <div className="flex flex-col space-y-2 items-center md:items-start">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.name.toLowerCase()}`}
                  className="text-primary-lighter hover:text-accent transition-colors duration-300"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </FooterAccordion>

          {/* Enlaces útiles - Desplegable en móvil */}
          <FooterAccordion 
            title="Enlaces útiles"
            className="w-full md:w-1/4 mb-6 md:mb-0"
          >
            <div className="flex flex-col space-y-2 items-center md:items-start">
              <Link href="/about" className="text-primary-lighter hover:text-accent transition-colors duration-300">
                Sobre Nosotros
              </Link>
              <Link href="/terms" className="text-primary-lighter hover:text-accent transition-colors duration-300">
                Términos y Condiciones
              </Link>
              <Link href="/privacy" className="text-primary-lighter hover:text-accent transition-colors duration-300">
                Política de Privacidad
              </Link>
              <Link href="/shipping" className="text-primary-lighter hover:text-accent transition-colors duration-300">
                Envíos y Devoluciones
              </Link>
              <Link href="/faq" className="text-primary-lighter hover:text-accent transition-colors duration-300">
                Preguntas Frecuentes
              </Link>
            </div>
          </FooterAccordion>

          {/* Contacto */}
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-accent">Contacto</h3>
            <div className="space-y-2">
              <p className="text-primary-lighter">San Rafael, Alajuela</p>
              <p className="text-primary-lighter">Teléfono: +506 8302-9383</p>
              <p className="text-primary-lighter">Email: alepescacr@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
