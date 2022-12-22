const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  active: { type: Boolean, default: true, required: true },
  bgColor: { type: String, default: 'F7F7F7'},
  textColor: { type: String, default: '1D1D1F' }
}, { timestamps: true })

module.exports = mongoose.model("Announcement", announcementSchema);