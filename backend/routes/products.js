const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product');
const { inferProductType, buildVariantPayload } = require('../utils/variationHelper');

const sanitizeBaseUrl = (url) => (url || '').replace(/\/$/, '');

const getNextProductId = async () => {
  const latestProduct = await Product.findOne().sort({ id: -1 }).lean();
  return latestProduct?.id ? latestProduct.id + 1 : 1;
};

module.exports = (upload, baseUrl = `http://localhost:${process.env.PORT || 4000}`) => {
  const normalizedBaseUrl = sanitizeBaseUrl(baseUrl);
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

  // Helper to build a query that matches either Mongo _id or numeric id
  const buildProductLookupQuery = (idParam) => {
    if (typeof idParam === 'undefined' || idParam === null) {
      return null;
    }

    const conditions = [];

    if (typeof idParam === 'string' && mongoose.Types.ObjectId.isValid(idParam)) {
      conditions.push({ _id: idParam });
    }

    const numericId = Number(idParam);
    if (!Number.isNaN(numericId)) {
      conditions.push({ id: numericId });
    }

    if (conditions.length === 0) {
      return null;
    }

    return conditions.length === 1 ? conditions[0] : { $or: conditions };
  };

  // Endpoint to fetch a single product by id
  router.get('/products/:id', async (req, res) => {
    try {
      const lookup = buildProductLookupQuery(req.params.id);
      if (!lookup) {
        return res.status(400).json({
          success: 0,
          message: 'Invalid product identifier',
        });
      }

      const product = await Product.findOne(lookup);
      if (!product) {
        return res.status(404).json({
          success: 0,
          message: 'Product not found',
        });
      }
      res.json({
        success: 1,
        product,
      });
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({
        success: 0,
        message: 'Error fetching product',
      });
    }
  });

  // Endpoint to add a product to the database
  router.post('/add-product', async (req, res) => {
    try {
      const id = await getNextProductId();
      const productType = inferProductType(req.body.productType, req.body.category);
      const variants = buildVariantPayload(req.body.variants, productType);

      const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        productType,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        description: req.body.description,
        variants,
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
      const lookup = buildProductLookupQuery(req.body.id);
      if (!lookup) {
        return res.status(400).json({
          success: 0,
          message: 'Invalid product identifier',
        });
      }

      const product = await Product.findOneAndDelete(lookup);
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

  // Endpoint to update a product by id
  router.put('/products/:id', async (req, res) => {
    try {
      const lookup = buildProductLookupQuery(req.params.id);
      if (!lookup) {
        return res.status(400).json({
          success: 0,
          message: 'Invalid product identifier',
        });
      }

      const product = await Product.findOne(lookup);
      if (!product) {
        return res.status(404).json({
          success: 0,
          message: 'Product not found',
        });
      }

      const allowedFields = ['name', 'image', 'category', 'new_price', 'old_price', 'description', 'available'];

      allowedFields.forEach((field) => {
        if (typeof req.body[field] !== 'undefined') {
          product[field] = req.body[field];
        }
      });

      if (typeof req.body.productType !== 'undefined') {
        product.productType = inferProductType(req.body.productType, req.body.category ?? product.category);
      }

      if (typeof req.body.variants !== 'undefined') {
        const resolvedType = product.productType || inferProductType(null, product.category);
        product.variants = buildVariantPayload(req.body.variants, resolvedType);
      }

      const updatedProduct = await product.save();

      res.json({
        success: 1,
        product: updatedProduct,
        message: 'Product updated successfully',
      });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({
        success: 0,
        message: 'Error updating product',
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
      profile_url: `${normalizedBaseUrl}/images/${req.file.filename}`,
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