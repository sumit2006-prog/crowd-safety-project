const mongoose = require('mongoose');

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Hospital', 'Ambulance', 'Fire Station', 'Police Station', 'Medical Booth', 'Security Point', 'Help Desk', 'Water Point', 'Toilet', 'Parking', 'Main Stage'],
    required: true
  },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  phone: { type: String, default: '112' },
  address: { type: String },
  capacity: { type: String },
  hasEmergencyDepartment: { type: Boolean, default: true },
  status: { type: String, enum: ['AVAILABLE', 'BUSY', 'CLOSED'], default: 'AVAILABLE' }
});

module.exports = mongoose.model('Facility', FacilitySchema);
