const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    icon: { type: String },
    banner: { type: String }
  }, { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
