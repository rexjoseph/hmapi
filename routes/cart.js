const router = require('express').Router();
const Cart = require('../models/Cart');
const Discount = require('../models/Discount');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// ADD TO CART
router.post('/', verifyToken, async (req, res) => {
  const newCart = new Cart(req.body)

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
})

// UPDATE CART
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
})

// DELETE CART
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json('Cart deleted');
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET A USER CART
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId: req.params.userId});
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET ALL CART
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find()
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
})

// ADD DISCOUNT TO DB
router.post('/new-discount', verifyTokenAndAdmin, async (req, res) => {
  const newDiscount = new Discount(req.body);
  try {
    const savedDiscount = await newDiscount.save();
    res.status(200).json(savedDiscount);
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET ALL DISCOUNTS IN DB
router.get('/all-discounts', verifyTokenAndAdmin, async (req, res) => {
  try {
    const discounts = await Discount.find()
    res.status(200).json(discounts);
  } catch (err) {
    res.status(500).json(err);
  }
})

// UPDATE DISCOUNT
router.put('/discount/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    res.status(200).json(updatedDiscount);
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET DISCOUNT FROM DB
router.get('/get-discount/:code', verifyToken, async (req, res) => {
  // console.log(req.params.code)
  let discountCode = req.params.code.toUpperCase();
  try {
    let foundDiscount = await Discount.findOne({ code: discountCode });
    res.status(200).json(foundDiscount);
  } catch (err) {
    res.status(404).json(err);
  }
})

// DELETE DISCOUNT
router.delete('/discount/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Discount.findByIdAndDelete(req.params.id);
    res.status(200).json('Discount deleted');
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;