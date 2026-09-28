const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  code: { type: String, required: true }, // e.g. Zone A, Zone B
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentCrowd: { type: Number, default: 0 },
  densityPercentage: { type: Number, default: 0 },
  status: { type: String, enum: ['SAFE', 'WARNING', 'CRITICAL'], default: 'SAFE' },
  trend: { type: String, enum: ['STABLE', 'INCREASING', 'DECREASING'], default: 'STABLE' },
  bounds: [{ lat: Number, lng: Number }]
});

module.exports = mongoose.model('Zone', ZoneSchema);
