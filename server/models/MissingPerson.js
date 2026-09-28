const mongoose = require('mongoose');

const SightingSchema = new mongoose.Schema({
  reporterName: { type: String, required: true },
  reporterPhone: { type: String },
  location: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  notes: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const MissingPersonSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  description: { type: String, required: true },
  clothing: { type: String, required: true },
  photoUrl: { type: String },
  lastSeenLocation: { type: String, required: true },
  lastSeenTime: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactName: { type: String, required: true },
  status: { type: String, enum: ['SEARCHING', 'INVESTIGATING', 'FOUND'], default: 'SEARCHING' },
  sightings: [SightingSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MissingPerson', MissingPersonSchema);
