const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Connect to MongoDB database using mongoose package.
mongoose.connect('mongodb+srv://arnaldolgonzalez96:jNfxhOUIu6tR0815@cluster0.ltsktky.mongodb.net/e-commerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// API routes.
app.get('/', (req, res) => { // Home route.
  res.send('Welcome to the E-commerce API');
});

// Define storage configuration for multer
const storage = multer.diskStorage({
  // Set the destination for the uploaded files
  destination: (req, file, cb) => {
    const uploadPath = 'upload/images'; // Directory to store images
    // Check if the directory exists, if not create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create directory recursively if it doesn't exist
    }
    cb(null, uploadPath); // Pass the directory path to the callback
  },
  // Define the filename for the uploaded files
  filename: (req, file, cb) => {
    // Create a unique filename using the field name, current timestamp, and original file extension
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

// Configure multer with the defined storage settings
const upload = multer({
  storage: storage,
});

// Serve images from the uploads folder.
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Upload image route. The image will be uploaded to the uploads folder and the image URL will be sent back to the client.
app.post('/upload', upload.single('productImage'), (req, res) => {
  console.log('File uploaded:', req.file);
  if (!req.file) {
    return res.status(400).json({
      success: 0,
      message: 'Image not uploaded'
    });
  }
  res.status(200).json({
    success: 1,
    profile_url: `http://localhost:${port}/images/${req.file.filename}`
  });
}, (error, req, res, next) => {
  console.error('Upload error:', error);
  res.status(500).json({
    success: 0,
    message: 'Internal server error'
  });
});

// Schema for the products collection.
const Product = mongoose.model('Product', {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  description: { type: String, required: true },
  // rating: { type: Number, required: true },
  // numReviews: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, required: true }
});

// Endpoint to add a product to the database.
app.post('/add-product', async (req, res) => {
  let products = await Product.find();
  let id;

  if (products.length > 0) { // If there are products in the database, get the last product and increment the id by 1.
    let lastProductArr = products.slice(-1);
    let lastProduct = lastProductArr[0];
    id = lastProduct.id + 1;
  } else { // If there are no products in the database, set the id to 1.
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
    description: req.body.description,
    available: req.body.available
  });
  console.log('Product:', product);

  try {
    await product.save();
    console.log('Product saved:', product);
    res.json({
      success: 1,
      name: req.body.name,
      message: 'Product saved successfully'
    });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({
      success: 0,
      message: err.message
    });
  }
});

// Endpoint to delete a product from the database by id.
app.post('/delete-product', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id }, (err, product) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).json({
        success: 0,
        message: err.message
      });
    } else {
      console.log('Product deleted:', product);
      res.json({
        success: 1,
        name: product.name,
        message: 'Product deleted successfully'
      });
    }
  });
});

// Endpoint to get all products from the database.
app.get('/products', async (req, res) => {
  let products = await Product.find();
  console.log('Products:', products);
  res.json({
    success: 1,
    products: products
  });
});

// Start the server.
app.listen(port, (err) => {
  if (err) {
    console.log('Error: ', err);
  } else {
    console.log(`Server running on port ${port}`);
  }
});