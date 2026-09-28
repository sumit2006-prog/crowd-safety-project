const mongoose = require('mongoose');

const ExitSchema = new mongoose.Schema({
  exitId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // e.g. Gate A, Gate B
  locationName: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentCrowd: { type: Number, default: 0 },
  status: { type: String, enum: ['OPEN', 'CONGESTED', 'BLOCKED'], default: 'OPEN' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  isRecommended: { type: Boolean, default: false }
});

module.exports = mongoose.model('Exit', ExitSchema);
