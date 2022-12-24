const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const esubscriptionSchema = new Schema({
  email: { type: String, required: true }
}, {timestamps: true});

module.exports = mongoose.model("EsubscriptionI", esubscriptionSchema);