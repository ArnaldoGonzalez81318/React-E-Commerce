const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Endpoint to register a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        error: 'The user already exists with this email.',
      });
    }

    const cart = {};
    const products = await Product.find();
    products.forEach((product) => {
      cart[product.id] = 0;
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      cartData: cart,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
        },
      },
      token,
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.',
    });
  }
});

// Endpoint to login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
        },
      },
      token,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.',
    });
  }
});

module.exports = router;