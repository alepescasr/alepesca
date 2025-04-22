import Container from "@/components/ui/container";

const PrivacyPage = () => {
  return (
    <Container>
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Información que Recopilamos</h2>
          <p className="text-lg mb-6">
            En AlePesca, recopilamos información personal cuando usted:
          </p>
          <ul className="list-disc pl-6 mb-6 text-lg">
            <li>Crea una cuenta en nuestro sitio web</li>
            <li>Realiza una compra</li>
            <li>Se suscribe a nuestro boletín</li>
            <li>Contacta con nuestro servicio de atención al cliente</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Uso de la Información</h2>
          <p className="text-lg mb-6">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 mb-6 text-lg">
            <li>Procesar sus pedidos y transacciones</li>
            <li>Personalizar su experiencia de compra</li>
            <li>Mejorar nuestro servicio al cliente</li>
            <li>Enviar comunicaciones promocionales (con su consentimiento)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Protección de Datos</h2>
          <p className="text-lg mb-6">
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso, modificación, divulgación o destrucción no autorizada.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Cookies</h2>
          <p className="text-lg mb-6">
            Utilizamos cookies y tecnologías similares para mejorar su experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Puede configurar su navegador para rechazar todas las cookies o indicar cuándo se envía una cookie.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Compartir Información</h2>
          <p className="text-lg mb-6">
            No vendemos ni compartimos su información personal con terceros, excepto cuando es necesario para proporcionar nuestros servicios (por ejemplo, procesamiento de pagos, envío de productos).
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Sus Derechos</h2>
          <p className="text-lg mb-6">
            Usted tiene derecho a:
          </p>
          <ul className="list-disc pl-6 mb-6 text-lg">
            <li>Acceder a sus datos personales</li>
            <li>Corregir datos inexactos</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al procesamiento de sus datos</li>
            <li>Retirar su consentimiento en cualquier momento</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Contacto</h2>
          <p className="text-lg mb-6">
            Si tiene preguntas sobre nuestra política de privacidad, puede contactarnos en:
          </p>
          <ul className="list-none pl-6 mb-6 text-lg">
            <li>Email: alepescasr@gmail.com</li>
            <li>Teléfono: +54 9 260 4203641</li>
            <li>Dirección: San Rafael, Mendoza, Argentina</li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default PrivacyPage; 