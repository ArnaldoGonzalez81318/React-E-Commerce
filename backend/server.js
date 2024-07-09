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

    // Check if the user already exists
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        error: 'The user already exists with this email.'
      });
    }

    // Initialize cart data
    const cart = {};
    let products = await Product.find();

    products.forEach((product) => {
      cart[product.id] = 0;
    });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      cartData: cart
    });

    // Save the user to the database
    await user.save();

    // Create JWT token
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

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Create JWT token
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

// Example usage in routes
app.post('/login', async (req, res, next) => {
  try {
    // Your login logic
  } catch (err) {
    next(err); // Pass the error to the global error handler
  }
});

// Endpoint for new collections
app.get('/new-collections', async (req, res) => {
  let products = await Product.find(); // Get all products from the database
  let newCollections = products.slice(1).slice(-8); // Get the last 8 products from the database

  console.log('New collections:', newCollections);

  res.json({
    success: 1,
    newCollections: newCollections
  });
});

// Endpoint for "Trending Women's Collection" products
app.get('/trending-women', async (req, res) => {
  let products = await Product.find({ category: "women" }); // Get all products from the database with the category "
  let trendingWomen = products.slice(0, 4); // Get the first 4 products from the database

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

  await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData }, (err, user) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).json({
        success: 0,
        message: err.message
      });
    } else {
      console.log('User:', user);
      res.json({
        success: 1,
        message: 'Product added to cart successfully'
      });
    }
  });
});

// Endpoint for removing a product from the cart data.
app.post('/remove-from-cart', fetchUser, async (req, res) => {
  let userData = await User.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.productId] > 0) {
    userData.cartData[req.body.productId] -= 1;
  } else {
    userData.cartData[req.body.productId] = 0;
  }

  await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData }, (err, user) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).json({
        success: 0,
        message: err.message
      });
    } else {
      console.log('User:', user);
      res.json({
        success: 1,
        message: 'Product removed from cart successfully'
      });
    }
  });
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