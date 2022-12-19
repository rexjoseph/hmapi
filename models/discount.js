const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const discountSchema = new Schema(
  {
   code: { type: String, unique: true },
   name: { type: String, unique: true},
   isPercent: { type: Boolean, required: true, default: true },
   amount: { type: Number, required: true },
   isActive: { type: Boolean, required: true, default: true },
   oneTime: { type: Boolean, default: false },
   totalUsage: { type: Number }
  }
, { timestamps: true } )
  
module.exports = mongoose.model('Discount', discountSchema);