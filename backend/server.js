const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
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
  res.send('Welcome to the e-commerce API');
});

// Image upload route using multer package.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Upload image middleware.
const upload = multer({
  storage: storage,
});

// Serve images from the uploads folder.
app.use('/images', express.static(path.join(__dirname, 'uploads/images')));

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
  rating: { type: Number, required: true },
  numReviews: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, required: true }
});

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

// Start the server.
app.listen(port, (err) => {
  if (err) {
    console.log('Error: ', err);
  } else {
    console.log(`Server running on port ${port}`);
  }
});