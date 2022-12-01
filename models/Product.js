const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  header: { type: String },
  comment: { type: String, required: true },
  rating: { type: Number, required: true }
}, { timestamps: true })

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  slug: { type: String },
  care_guide: { type: String },
  sustainability: { type: String },
  image: [ String ],
  categories: { type: Array },
  size: { type: Array },
  color: { type: Array },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true},
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema]
}, {timestamps: true})

module.exports = mongoose.model("Product", ProductSchema);