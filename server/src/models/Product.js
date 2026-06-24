import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        'keyboards',
        'mice',
        'headsets',
        'monitors',
        'controllers',
        'chairs',
        'capture-cards',
        'lighting',
      ],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    comparePrice: {
      type: Number,
    },
    description: {
      type: String,
    },
    specs: {
      type: Map,
      of: String,
    },
    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],
    stockStatus: {
      type: String,
      enum: ['in-stock', 'out-of-stock'],
      default: 'in-stock',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
