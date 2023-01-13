const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = new Schema(
  {
    title: { type: String },
    caption: { type: String },
    actionText: { type: String },
    image: { type: String },
    mobileImage: { type: String },
    video: { type: Boolean, default: false },
    video_source: { type: String },
    poster: { type: String },
    color: { type: String },
    textColor: { type: String },
    hoverColor: { type:  String },
    target: { type: String }
  }, { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
