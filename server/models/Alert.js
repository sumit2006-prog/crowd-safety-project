const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: String, enum: ['GREEN', 'YELLOW', 'ORANGE', 'RED'], default: 'YELLOW' },
  zone: { type: String, required: true },
  message: { type: String, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
