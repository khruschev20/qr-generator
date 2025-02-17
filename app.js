const express = require('express');
const qr = require('qr-image');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/generate', (req, res) => {
  const url = req.body.url;
  
  if (!url) {
    return res.status(400).send('Please enter a URL');
  }

  try {
    const qr_png = qr.imageSync(url, { type: 'png' });
    const qr_base64 = qr_png.toString('base64');
    res.send(`
      <h1>QR Code Generated!</h1>
      <img src="data:image/png;base64,${qr_base64}" alt="QR Code">
      <p>URL: ${url}</p>
      <a href="/">Generate another</a>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating QR code');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});