const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

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
const productRoutes = require('./routes/products')(upload); // Pass the upload middleware
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');

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
    console.log(`Server running on port ${port}`);
  }
});