const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
  user: {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  cart: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
      price: { type: Number, default: 0 },
      title: { type: String },
      color: { type: String },
      size: { type: String }
    }
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: false },
  paymentId: { type: String, required: true },
  trackingNum: { type: String },
  shippingCompany: { type: String },
  trackingLink: { type: String },
  status: { type: String, default: 'pending' }
}, {timestamps: true})

module.exports = mongoose.model("Order", OrderSchema);