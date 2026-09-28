const mongoose = require('mongoose');

const ResponderSchema = new mongoose.Schema({
  responderId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Medical', 'Fire', 'Security'], required: true },
  team: { type: String, required: true },
  phone: { type: String, default: '+91 98765 00000' },
  status: { type: String, enum: ['AVAILABLE', 'RESPONDING', 'BUSY', 'OFFLINE'], default: 'AVAILABLE' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  currentAssignment: { type: String, default: null }
});

module.exports = mongoose.model('Responder', ResponderSchema);
