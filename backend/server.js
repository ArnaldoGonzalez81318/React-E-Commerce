const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
const appBaseUrl = (process.env.APP_URL && process.env.APP_URL.replace(/\/$/, '')) || `http://localhost:${port}`;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Serve images from the uploads folder
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'upload/images';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  },
});

// Configure multer with the defined storage settings
const upload = multer({ storage: storage });

// Models
const Product = require('./models/Product');
const User = require('./models/User');

// Routes
const productRoutes = require('./routes/products')(upload, appBaseUrl); // Pass the upload middleware and base URL
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');

app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React E-Commerce API</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#0f172a; color:#e2e8f0; margin:0; padding:3rem; }
          main { max-width:720px; margin:0 auto; background:rgba(15,23,42,0.6); border-radius:1.5rem; padding:2rem; box-shadow:0 20px 60px rgba(15,23,42,0.45); }
          h1 { margin-top:0; font-size:2rem; }
          p { line-height:1.6; }
          code { background:rgba(148,163,184,0.15); padding:0.15rem 0.4rem; border-radius:0.4rem; }
          ul { padding-left:1.25rem; }
          a { color:#a5b4fc; text-decoration:none; }
          a:hover { text-decoration:underline; }
        </style>
      </head>
      <body>
        <main>
          <h1>React E-Commerce API</h1>
          <p>The backend is up and ready. Use the routes below from your frontend/admin apps or tools like Postman.</p>
          <ul>
            <li><code>GET /products</code> – fetch catalog items</li>
            <li><code>POST /add-product</code> – create a new product</li>
            <li><code>POST /signup</code> & <code>/login</code> – user auth</li>
            <li><code>GET /cart</code> – requires <code>Authorization: Bearer &lt;token&gt;</code></li>
            <li><code>GET /health</code> – quick status check</li>
          </ul>
          <p>Need docs? Visit the repository README or hit <a href="${appBaseUrl}/health">/health</a> for JSON status.</p>
        </main>
      </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = states[mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'ok',
    dbState,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/', productRoutes);
app.use('/', userRoutes);
app.use('/', cartRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: 0,
    error: 'Internal server error. Please try again later.',
  });
});

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.log('Error: ', err);
  } else {
    console.log(`Server running on port ${port} at http://localhost:${port}`);
  }
});