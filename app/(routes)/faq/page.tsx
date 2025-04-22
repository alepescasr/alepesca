import Container from "@/components/ui/container";

const FAQPage = () => {
  const faqs = [
    {
      question: "¿Cuáles son los métodos de pago aceptados?",
      answer: "Aceptamos múltiples formas de pago: tarjetas de crédito y débito, transferencia bancaria, Mercado Pago y efectivo en el local. Para compras online, puedes usar cualquier tarjeta de crédito o débito a través de nuestra plataforma segura de pago."
    },
    {
      question: "¿Cuánto tiempo demora el envío?",
      answer: "Los tiempos de envío varían según tu ubicación: 24-48 horas para San Rafael, 2-3 días para Mendoza Capital, y 3-7 días hábiles para el resto del país. Una vez realizado el envío, recibirás un código de seguimiento por email."
    },
    {
      question: "¿Tienen tienda física?",
      answer: "Sí, contamos con una tienda física en San Rafael, Mendoza. Te invitamos a visitarnos para ver nuestra amplia selección de productos y recibir asesoramiento personalizado de nuestro equipo de expertos."
    },
    {
      question: "¿Ofrecen garantía en los productos?",
      answer: "Sí, todos nuestros productos cuentan con garantía del fabricante. El período de garantía varía según el producto y la marca. Además, ofrecemos 30 días de garantía de satisfacción en todas las compras."
    },
    {
      question: "¿Cómo puedo hacer una devolución?",
      answer: "Para realizar una devolución, contacta a nuestro servicio al cliente dentro de los 30 días posteriores a la compra. El producto debe estar sin uso y en su empaque original. Te enviaremos una etiqueta de devolución y procesaremos tu reembolso una vez recibido el producto."
    },
    {
      question: "¿Hacen envíos internacionales?",
      answer: "Por el momento, solo realizamos envíos dentro de Argentina. Estamos trabajando para expandir nuestros servicios a países limítrofes en el futuro."
    },
    {
      question: "¿Ofrecen asesoramiento para principiantes?",
      answer: "¡Sí! Ofrecemos asesoramiento personalizado tanto en nuestra tienda física como online. Nuestro equipo está capacitado para ayudarte a elegir el equipo adecuado según tu nivel de experiencia y necesidades específicas."
    },
    {
      question: "¿Tienen programa de fidelización?",
      answer: "Sí, contamos con un programa de puntos donde acumulas beneficios por cada compra. También ofrecemos descuentos especiales para clientes frecuentes y promociones exclusivas para miembros de nuestra comunidad."
    },
    {
      question: "¿Organizan eventos o salidas de pesca?",
      answer: "Sí, regularmente organizamos eventos, talleres y salidas de pesca. Síguenos en nuestras redes sociales o suscríbete a nuestro boletín para mantenerte informado sobre próximas actividades."
    },
    {
      question: "¿Cómo puedo contactarlos?",
      answer: "Puedes contactarnos a través de varios canales: WhatsApp (+54 9 260 4203641), email ( alepescasr@gmail.com), o visitando nuestra tienda física en San Rafael, Mendoza."
    }
  ];

  return (
    <Container>
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Preguntas Frecuentes</h1>
        
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold mb-4 text-primary">
                {faq.question}
              </h2>
              <p className="text-lg text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary-lighter/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">¿No encontraste lo que buscabas?</h2>
          <p className="text-lg mb-4">
            Nuestro equipo está disponible para ayudarte con cualquier consulta adicional.
          </p>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="font-semibold">WhatsApp:</span> +54 9 2604 203641
            </p>
            <p className="text-lg">
              <span className="font-semibold">Email:</span> alepescasr@gmail.com
            </p>
            <p className="text-lg">
              <span className="font-semibold">Horario de atención:</span> Lunes a sabado de 9:00 a 13:00 y de 16:30 a 21:00.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FAQPage; 