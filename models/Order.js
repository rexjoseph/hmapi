const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
  user: {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
        title: { type: String },
        color: { type: String },
        size: { type: String }
      }
    ]
  },
  totalCost: { type: Number, default: 0, required: true },
  totalQty: { type: Number, default: 0, required: true },
  unitNumber: { type: Number },
  address: { type: Object, required: false },
  discountCode: { type: String },
  paymentId: { type: String, required: true },
  paymentType: { type: String },
  paymentAccountNumber: { type: String },
  trackingNum: { type: String },
  shippingCompany: { type: String },
  trackingLink: { type: String },
  status: { type: String, default: 'pending' }
}, {timestamps: true})

module.exports = mongoose.model("Order", OrderSchema);