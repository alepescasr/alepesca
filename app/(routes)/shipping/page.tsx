import Container from "@/components/ui/container";

const ShippingPage = () => {
  return (
    <Container>
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Envíos y Devoluciones</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold mt-8 mb-4">Política de Envíos</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Tiempos de Entrega</h3>
          <ul className="list-disc pl-6 mb-6 text-lg">
            <li>San Rafael: 24-48 horas hábiles</li>
            <li>Mendoza Capital: 2-3 días hábiles</li>
            <li>Resto del país: 3-7 días hábiles</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Costos de Envío</h3>
          <p className="text-lg mb-6">
            Los costos de envío se calculan automáticamente en el checkout según tu ubicación. Ofrecemos envío gratis en compras superiores a $50.000 en San Rafael y alrededores.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Seguimiento de Pedidos</h3>
          <p className="text-lg mb-6">
            Una vez que tu pedido sea despachado, recibirás por email el número de seguimiento para que puedas rastrear tu envío en tiempo real.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Política de Devoluciones</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Plazo para Devoluciones</h3>
          <p className="text-lg mb-6">
            Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto. El artículo debe estar sin uso y en su empaque original.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Proceso de Devolución</h3>
          <ol className="list-decimal pl-6 mb-6 text-lg">
            <li className="mb-2">Contacta a nuestro servicio al cliente para iniciar la devolución</li>
            <li className="mb-2">Te enviaremos una etiqueta de devolución por email</li>
            <li className="mb-2">Empaca el producto en su embalaje original</li>
            <li className="mb-2">Envía el paquete usando la etiqueta proporcionada</li>
            <li>Una vez recibido y verificado, procesaremos tu reembolso</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Condiciones</h3>
          <ul className="list-disc pl-6 mb-6 text-lg">
            <li>El producto debe estar sin usar</li>
            <li>Debe incluir todos los accesorios y etiquetas originales</li>
            <li>El empaque debe estar en buen estado</li>
            <li>Debes presentar el comprobante de compra</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Reembolsos</h3>
          <p className="text-lg mb-6">
            Los reembolsos se procesarán en un plazo de 5-10 días hábiles después de recibir y verificar el producto devuelto. El reembolso se realizará en el mismo método de pago utilizado para la compra.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Productos Dañados o Defectuosos</h2>
          <p className="text-lg mb-6">
            Si recibes un producto dañado o defectuoso, por favor contáctanos dentro de las 48 horas de recibido. Cubriremos los gastos de envío para la devolución y te enviaremos un reemplazo sin costo adicional.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Contacto</h2>
          <p className="text-lg mb-6">
            Para cualquier consulta sobre envíos o devoluciones, contáctanos:
          </p>
          <ul className="list-none pl-6 mb-6 text-lg">
            <li>WhatsApp: +54 9 260 4203641</li>
            <li>Email: alepescasr@gmail.com</li>
            <li>Teléfono: (260) 4203641</li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default ShippingPage; 