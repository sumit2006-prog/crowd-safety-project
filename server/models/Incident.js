const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['Medical', 'Fire', 'Blocked Exit', 'Crowd Problem', 'Security Issue', 'Lighting Problem', 'Water Problem', 'Facility Problem', 'Lost Item', 'Missing Person'],
    required: true
  },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  locationName: { type: String, required: true },
  zone: { type: String, default: 'Zone A' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  description: { type: String, required: true },
  photoUrl: { type: String },
  reporterPhone: { type: String },
  verificationStatus: { type: String, enum: ['UNVERIFIED', 'VERIFIED', 'REJECTED'], default: 'UNVERIFIED' },
  status: { type: String, enum: ['Reported', 'Verified', 'Assigned', 'Responding', 'Arrived', 'Resolved'], default: 'Reported' },
  assignedResponderId: { type: String, default: null },
  assignedResponderName: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', IncidentSchema);
