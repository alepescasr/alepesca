const https = require('https');
const fs = require('fs');
const path = require('path');

const gifUrl = 'http://gifgifs.com/animations/hobbies-entertainment/fishing/Flyfishing.gif';
const outputPath = path.join(__dirname, '../public/fishing.gif');

// Asegurarse de que el directorio public existe
if (!fs.existsSync(path.join(__dirname, '../public'))) {
  fs.mkdirSync(path.join(__dirname, '../public'));
}

https.get(gifUrl, (response) => {
  if (response.statusCode === 200) {
    response.pipe(fs.createWriteStream(outputPath));
    console.log('Gif descargado exitosamente');
  } else {
    console.error('Error al descargar el gif:', response.statusCode);
  }
}).on('error', (err) => {
  console.error('Error al descargar el gif:', err.message);
}); 