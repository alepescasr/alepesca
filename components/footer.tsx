import Image from "next/image";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="border-t border-primary-light bg-primary text-black pt-12 pb-6">
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
            <li><a href="#" className="text-primary-lighter hover:text-white transition-colors duration-300">Cañas de Pescar</a></li>
            <li><a href="#" className="text-primary-lighter hover:text-white transition-colors duration-300">Carretes</a></li>
            <li><a href="#" className="text-primary-lighter hover:text-white transition-colors duration-300">Señuelos</a></li>
            <li><a href="#" className="text-primary-lighter hover:text-white transition-colors duration-300">Accesorios</a></li>
            <li><a href="#" className="text-primary-lighter hover:text-white transition-colors duration-300">Ropa</a></li>
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
          <ul className="space-y-3">
            <li className="flex items-start">
              <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-primary-lighter" />
              <span className="text-primary-lighter">Av. Principal 123, Ciudad</span>
            </li>
            <li className="flex items-center">
              <Phone size={18} className="mr-2 flex-shrink-0 text-primary-lighter" />
              <span className="text-primary-lighter">+1 234 567 890</span>
            </li>
            <li className="flex items-center">
              <Mail size={18} className="mr-2 flex-shrink-0 text-primary-lighter" />
              <span className="text-primary-lighter">info@pescashop.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-primary-light mt-10 pt-6">
        <p className="text-center text-primary-lighter text-sm">
          &copy; {new Date().getFullYear()} PescaShop. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
