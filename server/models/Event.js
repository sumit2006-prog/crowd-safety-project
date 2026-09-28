const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Central Festival 2026' },
  tagline: { type: String, default: 'Annual Music & Cultural Celebration' },
  venue: { type: String, default: 'Central City Grounds' },
  date: { type: String, default: 'September 26-28, 2026' },
  expectedCrowd: { type: Number, default: 20000 },
  currentCrowd: { type: Number, default: 12540 },
  activeRespondersCount: { type: Number, default: 18 },
  totalRespondersCount: { type: Number, default: 24 },
  centerLat: { type: Number, default: 12.9716 },
  centerLng: { type: Number, default: 77.5946 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
