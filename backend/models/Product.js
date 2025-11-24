const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  sizeType: {
    type: String,
    enum: ['alpha', 'numeric', 'none'],
    default: 'none',
  },
  sizes: {
    type: [String],
    default: [],
  },
  colors: {
    type: [String],
    default: [],
  },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  productType: {
    type: String,
    enum: ['apparel', 'footwear', 'accessory', 'other'],
    default: 'other',
  },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  description: { type: String, required: true },
  variants: {
    type: VariantSchema,
    default: () => ({})
  },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, required: true },
});

module.exports = mongoose.model('Product', ProductSchema);