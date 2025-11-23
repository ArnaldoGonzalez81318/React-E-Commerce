const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware to fetch the user data from the database using the user id from the JWT token
const fetchUser = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  let data;

  try {
    data = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const user = await User.findOne({ _id: data.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = user; // Attach user object to the request
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const ensureProductId = (productId, res) => {
  if (typeof productId === 'undefined' || productId === null) {
    res.status(400).json({ success: 0, message: 'productId is required' });
    return false;
  }
  return true;
};

// Endpoint to add a product to the cart data
router.post('/add-to-cart', fetchUser, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!ensureProductId(productId, res)) return;
    const key = productId.toString();
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    req.user.cartData[key] = (req.user.cartData[key] || 0) + safeQuantity;

    await req.user.save();
    res.json({
      success: 1,
      message: 'Product added to cart successfully',
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      success: 0,
      message: 'Error adding product to cart',
    });
  }
});

// Endpoint to remove a product from the cart data
router.post('/remove-from-cart', fetchUser, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!ensureProductId(productId, res)) return;
    const key = productId.toString();
    const current = req.user.cartData[key] || 0;
    req.user.cartData[key] = Math.max(0, current - 1);

    await req.user.save();
    res.json({
      success: 1,
      message: 'Product removed from cart successfully',
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      success: 0,
      message: 'Error removing product from cart',
    });
  }
});

// Endpoint to remove a product completely from the cart
router.post('/remove-product-from-cart', fetchUser, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!ensureProductId(productId, res)) return;
    const key = productId.toString();
    req.user.cartData[key] = 0;

    await req.user.save();
    res.json({
      success: 1,
      message: 'Product removed completely from cart',
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      success: 0,
      message: 'Error removing product completely from cart',
    });
  }
});

// Endpoint to get the cart data for the user
router.get('/cart', fetchUser, async (req, res) => {
  try {
    res.json({
      success: 1,
      cartData: req.user.cartData,
    });
  } catch (err) {
    console.error('Error fetching cart data:', err);
    res.status(500).json({
      success: 0,
      message: 'Error fetching cart data',
    });
  }
});

module.exports = router;