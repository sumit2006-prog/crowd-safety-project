const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const Zone = require('./models/Zone');
const Facility = require('./models/Facility');
const Exit = require('./models/Exit');
const Incident = require('./models/Incident');
const Responder = require('./models/Responder');
const MissingPerson = require('./models/MissingPerson');
const Alert = require('./models/Alert');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crowd_safe');
    console.log('[Seed] Connected to MongoDB');

    await Event.deleteMany({});
    await Zone.deleteMany({});
    await Facility.deleteMany({});
    await Exit.deleteMany({});
    await Incident.deleteMany({});
    await Responder.deleteMany({});
    await MissingPerson.deleteMany({});
    await Alert.deleteMany({});

    await Event.create({
      name: 'Central Festival 2026',
      tagline: 'Real-Time Safety & Emergency Coordination Platform',
      venue: 'Central City Event Grounds',
      date: 'September 26-28, 2026',
      expectedCrowd: 20000,
      currentCrowd: 12540,
      activeRespondersCount: 18,
      totalRespondersCount: 24,
      centerLat: 12.9716,
      centerLng: 77.5946
    });

    console.log('[Seed] Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedData();
