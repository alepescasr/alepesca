import Image from "next/image";

const WorkingProgress = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900">
          ¡Trabajando en el Sitio!
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Estamos mejorando nuestra tienda para brindarte una mejor experiencia de compra.
        </p>
        <div className="relative w-96 h-96 mx-auto">
          <Image
            src="http://gifgifs.com/animations/hobbies-entertainment/fishing/Flyfishing.gif"
            alt="Pescador con mosca animado"
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-lg text-gray-500">
          Volveremos pronto con novedades...
        </p>
      </div>
    </div>
  );
};

export default WorkingProgress; 