import Container from "@/components/ui/container";
import Image from "next/image";

const AboutPage = () => {
  const images = [
    {
      src: "/images/about/about1.jpg",
      alt: "Local comercial AlePescaSR",
      caption: "Nuestro local en San Rafael"
    },
    {
      src: "/images/about/about2.jpg",
      alt: "Equipo AlePescaSR",
      caption: "Nuestro equipo de expertos"
    },
    {
      src: "/images/about/about3.jpg",
      alt: "Productos de pesca",
      caption: "Amplia selección de productos"
    }
  ];

  return (
    <Container>
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Sobre Nosotros</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <div className="aspect-square relative overflow-hidden rounded-xl">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <p className="text-center mt-2 text-gray-600">{image.caption}</p>
            </div>
          ))}
        </div>

        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            En AlePescaSR, nos apasiona la pesca deportiva y nos enorgullece ser el destino preferido de los pescadores en San Rafael, Mendoza. Con más de una década de experiencia en el sector, nos hemos consolidado como líderes en la provisión de equipos y accesorios de pesca de la más alta calidad.
          </p>

          <p className="text-lg mb-6">
            Nuestro equipo está formado por expertos apasionados que no solo venden productos, sino que comparten sus conocimientos y experiencias con cada cliente. Entendemos que cada pescador tiene necesidades únicas, y nos esforzamos por ofrecer un servicio personalizado que satisfaga esas necesidades.
          </p>

          <p className="text-lg mb-6">
            En nuestra tienda encontrarás una amplia selección de productos cuidadosamente seleccionados de las mejores marcas del mercado. Desde cañas y reeles hasta señuelos y accesorios, cada producto en nuestro inventario ha sido elegido por su calidad y rendimiento.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Nuestra Misión</h2>
          <p className="text-lg mb-6">
            Nuestra misión es proporcionar a los pescadores deportivos los mejores productos y servicios, respaldados por un asesoramiento experto y un servicio al cliente excepcional. Nos esforzamos por ser más que una tienda de pesca; queremos ser tu socio confiable en cada aventura de pesca.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Compromiso con la Comunidad</h2>
          <p className="text-lg mb-6">
            En AlePescaSR, creemos en la importancia de construir una comunidad de pescadores responsables. Organizamos regularmente eventos, talleres y salidas de pesca para compartir conocimientos y promover prácticas de pesca sostenibles que ayuden a preservar nuestros recursos naturales para las generaciones futuras.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default AboutPage; 