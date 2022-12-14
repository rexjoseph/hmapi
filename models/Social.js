const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ugcSocial = new Schema({
    photourl: {
        type: String
    },
    handle: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("Social", ugcSocial);