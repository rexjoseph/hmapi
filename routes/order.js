const router = require('express').Router();
const Order = require('../models/Order');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

// CREATE AN ORDER
router.post('/', verifyToken, async (req, res) => {
  let newOrder = new Order(req.body)

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
})

// UPDATE AN ORDER
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
})

// DELETE AN ORDER
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json('Order has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET ALL USER ORDERS
router.get('/find/:userId', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET SPECIFIC ORDER
router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    .populate({path: 'user', populate: {path: 'userId', model: 'User'}})
    .populate({path: 'cart', populate: {path: 'items', populate: {path: 'productId', model: 'Product'} }})
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET ALL ORDERS
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
})

// USER GET ALL ORDERS
router.get('/user/:userId', async (req, res, next) => {
  try {
    allOrders = await Order.find({ 'user.userId': req.params.userId })
    .populate({path: 'cart', populate: {path: 'items', populate: {path: 'productId', model: 'Product'} }})
    .sort({ createdAt: -1 })
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json(err)
  }
})

// SHOP MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getUTCMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$totalCost"
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" }
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;