const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Connect to MongoDB database using mongoose package.
mongoose.connect('mongodb+srv://arnaldolgonzalez96:jNfxhOUIu6tR0815@cluster0.ltsktky.mongodb.net/e-commerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// API routes.
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
});

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
  }
});

// Configure multer with the defined storage settings
const upload = multer({
  storage: storage,
});

// Serve images from the uploads folder.
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Upload image route.
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
  date: { type: Date, default: Date.now },
  available: { type: Boolean, required: true }
});

// Endpoint to add a product to the database.
app.post('/add-product', async (req, res) => {
  let products = await Product.find();
  let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

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
  try {
    const product = await Product.findOneAndDelete({ id: req.body.id });
    if (!product) {
      return res.status(404).json({
        success: 0,
        message: 'Product not found'
      });
    }
    console.log('Product deleted:', product);
    res.json({
      success: 1,
      name: product.name,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({
      success: 0,
      message: err.message
    });
  }
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

// Schema for the users collection
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Endpoint to register a new user
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        error: 'The user already exists with this email.'
      });
    }

    const cart = {};
    let products = await Product.find();
    products.forEach((product) => {
      cart[product.id] = 0;
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      cartData: cart
    });

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, 'secret', { expiresIn: '1h' });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email
        }
      },
      token
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
});

// Endpoint to login a user
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, 'secret', { expiresIn: '1h' });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email
        }
      },
      token
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error. Please try again later.'
  });
});

// Endpoint for new collections
app.get('/new-collections', async (req, res) => {
  let products = await Product.find();
  let newCollections = products.slice(-8);
  console.log('New collections:', newCollections);
  res.json({
    success: 1,
    newCollections: newCollections
  });
});

// Endpoint for "Trending Women's Collection" products
app.get('/trending-women', async (req, res) => {
  let products = await Product.find({ category: "women" });
  let trendingWomen = products.slice(0, 4);
  console.log('Trending in Women\'s Collection:', trendingWomen);
  res.json({
    success: 1,
    trendingWomen: trendingWomen
  });
});

// Middleware to fetch the user data from the database using the user id from the JWT token
const fetchUser = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const data = jwt.verify(token, 'secret');

  try {
    const user = await User.findOne({ _id: data.id });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Endpoint for adding a product to the cart data.
app.post('/add-to-cart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  userData.cartData[req.body.productId] += 1;

  try {
    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.json({
      success: 1,
      message: 'Product added to cart successfully'
    });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({
      success: 0,
      message: err.message
    });
  }
});

// Endpoint for removing a product from the cart data.
app.post('/remove-from-cart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  userData.cartData[req.body.productId] = Math.max(0, userData.cartData[req.body.productId] - 1);

  try {
    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.json({
      success: 1,
      message: 'Product removed from cart successfully'
    });
  } catch (err) {
    console.log('Error:', err);
    res.status(500).json({
      success: 0,
      message: err.message
    });
  }
});

// Endpoint to get the cart data for the user.
app.get('/cart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  console.log('Cart data:', userData.cartData);
  res.json({
    success: 1,
    cartData: userData.cartData
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