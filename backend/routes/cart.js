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

// Endpoint to add a product to the cart data
router.post('/add-to-cart', fetchUser, async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.user.id });
    userData.cartData[req.body.productId] += 1;

    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
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
    const userData = await User.findOne({ _id: req.user.id });
    userData.cartData[req.body.productId] = Math.max(0, userData.cartData[req.body.productId] - 1);

    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
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

// Endpoint to get the cart data for the user
router.get('/cart', fetchUser, async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.user.id });
    res.json({
      success: 1,
      cartData: userData.cartData,
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