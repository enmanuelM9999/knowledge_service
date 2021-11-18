const mongoose = require('mongoose');
const { Schema } = mongoose;
const path = require('path');

const ImageSchema = new Schema({
  title: { type: String },
  description: { type: String },
  filename: { type: String },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
},
  { timestamps: true }
);

module.exports = mongoose.model('Image', ImageSchema);
