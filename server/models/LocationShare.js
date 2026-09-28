const mongoose = require('mongoose');

const LocationShareSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userName: { type: String, default: 'Anonymous Visitor' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LocationShare', LocationShareSchema);
