import Image from "next/image";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import getCategories from "@/actions/get-categories";

const Footer = async () => {
  const categories = await getCategories();

  return (
    <footer className="border-t border-primary-light bg-primary text-white pt-12 pb-6">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">AlePescaSR</h3>
          <p className="text-primary-lighter mb-4">
            Tu tienda especializada en artículos de pesca deportiva con los mejores productos y marcas del mercado.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-primary-lighter hover:text-accent transition-colors duration-300">
              <Facebook size={20} />
            </Link>
            <a href="#" className="text-primary-lighter hover:text-accent transition-colors duration-300">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-primary-lighter hover:text-accent transition-colors duration-300">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-accent">Categorías</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link 
                  href={`/category/${category.name.toLowerCase()}`} 
                  className="text-primary-lighter hover:text-white transition-colors duration-300"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-accent">Enlaces Útiles</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-primary-lighter hover:text-white transition-colors duration-300">Sobre Nosotros</a></li>
            <li><a href="#" className="text-primary-lighter hover:text-white transition-colors duration-300">Términos y Condiciones</a></li>
            <li><a href="#" className="text-primary-lighter hover:text-white transition-colors duration-300">Política de Privacidad</a></li>
            <li><a href="#" className="text-primary-lighter hover:text-white transition-colors duration-300">Envíos y Devoluciones</a></li>
            <li><a href="#" className="text-primary-lighter hover:text-white transition-colors duration-300">Preguntas Frecuentes</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-accent">Contacto</h3>
          <ul className="space-y-4">
            <li className="flex items-center text-primary-lighter">
              <MapPin size={20} className="mr-2" />
              <span>San Rafael, Mendoza</span>
            </li>
            <li className="flex items-center text-primary-lighter">
              <Phone size={20} className="mr-2" />
              <span>+54 9 260 4123456</span>
            </li>
            <li className="flex items-center text-primary-lighter">
              <Mail size={20} className="mr-2" />
              <span>info@alepescasr.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-accent">Horarios</h3>
          <ul className="space-y-2">
            <li className="text-primary-lighter">Lunes a Viernes: 9:00 - 18:00</li>
            <li className="text-primary-lighter">Sábados: 9:00 - 13:00</li>
            <li className="text-primary-lighter">Domingos: Cerrado</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-primary-light text-center text-primary-lighter">
        <p>&copy; 2024 AlePescaSR. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
