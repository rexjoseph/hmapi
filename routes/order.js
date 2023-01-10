const router = require('express').Router();
const Order = require('../models/Order');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const SDKConstants = require("authorizenet").Constants;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// SHOP MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getUTCMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$totalCost",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" } 
        }
      }
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
})

// CREATE AN ORDER
router.post('/', verifyToken, async (req, res) => {
  let lastOrder = await Order.findOne().sort({ createdAt: -1 }).limit(1);
  let productUnitNumber;

  if (!lastOrder) {
    productUnitNumber = 1;
  } else if (!lastOrder.unitNumber) {
    productUnitNumber = 1;
  } else {
    productUnitNumber = lastOrder.unitNumber +1;
  }
 
  let newOrder = new Order(req.body)
  newOrder.unitNumber = productUnitNumber;
  try {
    const savedOrder = await newOrder.save();
    const msg = {
      to: req.body.user.email,
      from: { 
        name: 'Hashingmart', email: 'help@hashingmart.com' 
      },
      templateId: process.env.ORDER_TEMPLATE_ID,
      dynamic_template_data: {
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        address: req.body.address.street,
        apartment: req.body.address.apartment,
        city: req.body.address.city,
        state: req.body.address.state,
        zip: req.body.address.zip,
        totalCost: req.body.totalCost,
        orderId: savedOrder.unitNumber
      }
    }

    await sgMail.send(msg, function(err, sent) {
      if (err) {
        console.log(err);
      }
    })
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

module.exports = router;