const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const mercadoPagoUrl = 'http://alepescasr.mp/';

// Asegurarse de que el directorio existe
const qrDirectory = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(qrDirectory)) {
  fs.mkdirSync(qrDirectory, { recursive: true });
}

// Generar el QR
QRCode.toFile(
  path.join(qrDirectory, 'qr-mercadopago.png'),
  mercadoPagoUrl,
  {
    color: {
      dark: '#000',
      light: '#FFF'
    },
    width: 800,
    margin: 1,
    errorCorrectionLevel: 'H'
  },
  function (err) {
    if (err) throw err;
  }
); 