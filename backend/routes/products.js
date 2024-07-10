const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

module.exports = (upload) => {
  // Endpoint to get all products from the database
  router.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json({
        success: 1,
        products: products,
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({
        success: 0,
        message: 'Error fetching products',
      });
    }
  });

  // Endpoint to add a product to the database
  router.post('/add-product', async (req, res) => {
    try {
      const products = await Product.find();
      const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

      const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        description: req.body.description,
        available: req.body.available,
      });

      await product.save();
      res.json({
        success: 1,
        message: 'Product saved successfully',
      });
    } catch (err) {
      console.error('Error saving product:', err);
      res.status(500).json({
        success: 0,
        message: 'Error saving product',
      });
    }
  });

  // Endpoint to delete a product from the database by id
  router.post('/delete-product', async (req, res) => {
    try {
      const product = await Product.findOneAndDelete({ id: req.body.id });
      if (!product) {
        return res.status(404).json({
          success: 0,
          message: 'Product not found',
        });
      }
      res.json({
        success: 1,
        message: 'Product deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({
        success: 0,
        message: 'Error deleting product',
      });
    }
  });

  // Endpoint for new collections
  router.get('/new-collections', async (req, res) => {
    try {
      const products = await Product.find();
      const newCollections = products.slice(-8);
      res.json({
        success: 1,
        newCollections: newCollections,
      });
    } catch (err) {
      console.error('Error fetching new collections:', err);
      res.status(500).json({
        success: 0,
        message: 'Error fetching new collections',
      });
    }
  });

  // Endpoint for "Trending Women's Collection" products
  router.get('/trending-women', async (req, res) => {
    try {
      const products = await Product.find({ category: 'women' });
      const trendingWomen = products.slice(0, 4);
      res.json({
        success: 1,
        trendingWomen: trendingWomen,
      });
    } catch (err) {
      console.error('Error fetching trending women\'s collection:', err);
      res.status(500).json({
        success: 0,
        message: 'Error fetching trending women\'s collection',
      });
    }
  });

  // Upload image route
  router.post('/upload', upload.single('productImage'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: 0,
        message: 'Image not uploaded',
      });
    }
    res.status(200).json({
      success: 1,
      profile_url: `http://localhost:${process.env.PORT}/images/${req.file.filename}`,
    });
  }, (error, req, res, next) => {
    console.error('Upload error:', error);
    res.status(500).json({
      success: 0,
      message: 'Internal server error',
    });
  });

  return router;
};