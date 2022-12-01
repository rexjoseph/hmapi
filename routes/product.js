const router = require('express').Router();
const Product = require('../models/Product');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// MAKE NEW PRODUCT
router.post('/', async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
})

// EDIT PRODUCT
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
      res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
})

// DELETE PRODUCT
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json('Product deleted')
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET SINGLE PRODUCT
router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  const qLatest = req.query.latest;
  const qCategory = req.query.category;

  try {
    let products;
    if (qLatest) {
      products = await Product.find().sort({ createdAt: -1 }).limit(10)
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory]
        }
      })
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
})

// ADD NEW REVIEW
router.post('/:id/reviews', async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (product) {
    if (product.reviews.find((x) => x.firstName === req.body.firstName)) {
      return res.status(400).send({message: 'You already submitted a review'});
    }
    const review = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      rating: Number(req.body.rating),
      comment: req.body.comment
    }
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = 
      product.reviews.reduce((a, c) => c.rating + a, 0) / 
      product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).json({review: updatedProduct.reviews[updatedProduct.reviews.length - 1]});
  } else {
    res.status(404).send({message: 'Product not found'});
  }
})

module.exports = router;