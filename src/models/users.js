const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;
const path = require('path');

const UserSchema = new Schema({
  image_id: { type: ObjectId },
  user_email: { type: String, required:true, unique:true },
  user_name: { type: String },
  gravatar: { type: String },
  comment: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);