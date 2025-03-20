import Container from "@/components/ui/container";

const TermsPage = () => {
  return (
    <Container>
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Aceptación de los Términos</h2>
          <p className="text-lg mb-6">
            Al acceder y utilizar el sitio web de AlePescaSR, usted acepta estos términos y condiciones en su totalidad. Si no está de acuerdo con estos términos, por favor no utilice nuestro sitio web.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Uso del Sitio</h2>
          <p className="text-lg mb-6">
            El contenido de este sitio es únicamente para su información general y uso personal. Está sujeto a cambios sin previo aviso.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Precios y Disponibilidad</h2>
          <p className="text-lg mb-6">
            Los precios y la disponibilidad de los productos están sujetos a cambios sin previo aviso. Nos reservamos el derecho de discontinuar cualquier producto en cualquier momento.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Proceso de Compra</h2>
          <p className="text-lg mb-6">
            Al realizar una compra, usted garantiza que tiene la capacidad legal para realizar transacciones. Todas las órdenes están sujetas a disponibilidad y confirmación del precio.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Cuenta de Usuario</h2>
          <p className="text-lg mb-6">
            Es responsabilidad del usuario mantener la confidencialidad de su cuenta y contraseña. AlePescaSR no será responsable por cualquier uso no autorizado de su cuenta.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Propiedad Intelectual</h2>
          <p className="text-lg mb-6">
            Todo el contenido incluido en este sitio, como textos, gráficos, logos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de AlePescaSR o sus proveedores de contenido y está protegido por las leyes argentinas e internacionales.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitación de Responsabilidad</h2>
          <p className="text-lg mb-6">
            AlePescaSR no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de usar nuestros servicios.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Modificaciones</h2>
          <p className="text-lg mb-6">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Ley Aplicable</h2>
          <p className="text-lg mb-6">
            Estos términos se regirán e interpretarán de acuerdo con las leyes de la República Argentina, y cualquier disputa estará sujeta a la jurisdicción exclusiva de los tribunales de San Rafael, Mendoza.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default TermsPage; 