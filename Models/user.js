const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  emailVerified: { type: Boolean, default: false },
  role: { type: String, default: 'artist' }
});

module.exports = mongoose.model('User', UserSchema);
