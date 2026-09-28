const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// In-Memory Data Store fallback when MongoDB is disconnected
let mockStore = {
  event: {
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
  },
  zones: [
    { code: 'Zone A', name: 'Main Stage Arena', capacity: 6000, currentCrowd: 2100, densityPercentage: 35, status: 'SAFE', trend: 'STABLE' },
    { code: 'Zone B', name: 'Food & Cultural Court', capacity: 5000, currentCrowd: 3350, densityPercentage: 67, status: 'WARNING', trend: 'INCREASING' },
    { code: 'Zone C', name: 'North Lawn & Pavilion', capacity: 4000, currentCrowd: 3640, densityPercentage: 91, status: 'CRITICAL', trend: 'INCREASING' },
    { code: 'Zone D', name: 'South Gate Corridor', capacity: 5000, currentCrowd: 2600, densityPercentage: 52, status: 'SAFE', trend: 'STABLE' },
    { code: 'Zone E', name: 'VIP & Press Enclosure', capacity: 1500, currentCrowd: 450, densityPercentage: 30, status: 'SAFE', trend: 'STABLE' },
    { code: 'Zone F', name: 'Exhibition Hall B', capacity: 3000, currentCrowd: 1400, densityPercentage: 46, status: 'SAFE', trend: 'DECREASING' },
    { code: 'Zone G', name: 'Carnival Ride Zone', capacity: 3500, currentCrowd: 2200, densityPercentage: 62, status: 'WARNING', trend: 'STABLE' },
    { code: 'Zone H', name: 'Main Entry Plaza', capacity: 4500, currentCrowd: 2800, densityPercentage: 62, status: 'SAFE', trend: 'DECREASING' }
  ],
  facilities: [
    { id: 'hosp-1', name: 'City General Hospital', type: 'Hospital', lat: 12.9780, lng: 77.5990, phone: '+91 80 2222 1111', address: '1.2 km North', capacity: 'Emergency Dept Ready', hasEmergencyDepartment: true, status: 'AVAILABLE' },
    { id: 'hosp-2', name: 'St. Mary Trauma Care Center', type: 'Hospital', lat: 12.9650, lng: 77.5880, phone: '+91 80 3333 4444', address: '2.4 km South West', capacity: '24/7 ER Available', hasEmergencyDepartment: true, status: 'AVAILABLE' },
    { id: 'hosp-3', name: 'Apex Multi-Specialty Clinic', type: 'Hospital', lat: 12.9750, lng: 77.6050, phone: '+91 80 5555 6666', address: '3.1 km East', capacity: 'Outpatient & Triage', hasEmergencyDepartment: true, status: 'AVAILABLE' },
    { id: 'fire-1', name: 'Central Fire Station 01', type: 'Fire Station', lat: 12.9730, lng: 77.6010, phone: '112', address: '800 m North East', status: 'AVAILABLE' },
    { id: 'fire-2', name: 'Westside Mobile Fire Unit', type: 'Fire Station', lat: 12.9690, lng: 77.5890, phone: '112', address: '1.5 km West', status: 'AVAILABLE' },
    { id: 'med-1', name: 'First Aid Booth - Main Stage', type: 'Medical Booth', lat: 12.9720, lng: 77.5950, phone: '+91 98000 11101', address: 'Near Main Stage (Zone A)', status: 'AVAILABLE' },
    { id: 'med-2', name: 'Medical Post - Food Court', type: 'Medical Booth', lat: 12.9710, lng: 77.5940, phone: '+91 98000 11102', address: 'Zone B Central', status: 'AVAILABLE' },
    { id: 'med-3', name: 'Emergency Triage Alpha', type: 'Medical Booth', lat: 12.9705, lng: 77.5960, phone: '+91 98000 11103', address: 'East Entrance', status: 'AVAILABLE' },
    { id: 'med-4', name: 'Mobile Ambulance Unit 04', type: 'Ambulance', lat: 12.9725, lng: 77.5935, phone: '112', address: 'Stationed Gate B', status: 'AVAILABLE' },
    { id: 'sec-1', name: 'Security Command Point 01', type: 'Security Point', lat: 12.9715, lng: 77.5942, phone: '+91 98000 22201', address: 'Zone A Control', capacity: '5 Security Staff', status: 'AVAILABLE' },
    { id: 'sec-2', name: 'Police Help Desk - Main Entrance', type: 'Police Station', lat: 12.9735, lng: 77.5955, phone: '+91 80 2294 2222', address: 'Gate A Perimeter', status: 'AVAILABLE' },
    { id: 'sec-3', name: 'Security Help Point 02', type: 'Security Point', lat: 12.9700, lng: 77.5938, phone: '+91 98000 22202', address: 'Zone C Corridor', capacity: '4 Security Staff', status: 'BUSY' },
    { id: 'sec-4', name: 'Crowd Safety Desk Gate C', type: 'Help Desk', lat: 12.9695, lng: 77.5950, phone: '+91 98000 22203', address: 'Gate C Exit Plaza', status: 'AVAILABLE' },
    { id: 'sec-5', name: 'Riot & Patrol Unit Station', type: 'Security Point', lat: 12.9728, lng: 77.5968, phone: '+91 98000 22204', address: 'North Perimeter Gate D', status: 'AVAILABLE' }
  ],
  exits: [
    { exitId: 'gate-a', name: 'Gate A - Main North Entrance', locationName: 'North Perimeter Road', capacity: 5000, currentCrowd: 1800, status: 'OPEN', lat: 12.9735, lng: 77.5946, isRecommended: true },
    { exitId: 'gate-b', name: 'Gate B - East Boulevard Exit', locationName: 'East Avenue Plaza', capacity: 4000, currentCrowd: 950, status: 'OPEN', lat: 12.9716, lng: 77.5975, isRecommended: true },
    { exitId: 'gate-c', name: 'Gate C - South Promenade Gate', locationName: 'South Park Drive', capacity: 4500, currentCrowd: 3800, status: 'CONGESTED', lat: 12.9692, lng: 77.5946, isRecommended: false },
    { exitId: 'gate-d', name: 'Gate D - West Emergency Exit', locationName: 'West Service Lane', capacity: 3500, currentCrowd: 1200, status: 'OPEN', lat: 12.9716, lng: 77.5915, isRecommended: false }
  ],
  incidents: [
    { incidentId: 'INC-1001', type: 'Medical', severity: 'HIGH', locationName: 'Zone B Food Court', zone: 'Zone B', lat: 12.9712, lng: 77.5941, description: 'Dehydration & fainting near food stall #4', verificationStatus: 'VERIFIED', status: 'Responding', assignedResponderId: 'RESP-01', assignedResponderName: 'Medical Team 01 (Paramedic Alpha)', createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
    { incidentId: 'INC-1002', type: 'Crowd Problem', severity: 'MEDIUM', locationName: 'Gate C Bottleneck', zone: 'Zone C', lat: 12.9695, lng: 77.5945, description: 'Heavy crowd surge building at exit turnstiles', verificationStatus: 'VERIFIED', status: 'Assigned', assignedResponderId: 'RESP-05', assignedResponderName: 'Security Team 01', createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
    { incidentId: 'INC-1003', type: 'Lighting Problem', severity: 'LOW', locationName: 'Zone D West Pathway', zone: 'Zone D', lat: 12.9708, lng: 77.5925, description: 'Floodlight fixture flickering near restroom complex', verificationStatus: 'UNVERIFIED', status: 'Reported', assignedResponderId: null, assignedResponderName: null, createdAt: new Date(Date.now() - 8 * 60000).toISOString() }
  ],
  responders: [
    { responderId: 'RESP-01', name: 'Dr. Aarav Sharma', type: 'Medical', team: 'Medical Team 01', phone: '+91 98765 11111', status: 'RESPONDING', lat: 12.9714, lng: 77.5943, currentAssignment: 'INC-1001' },
    { responderId: 'RESP-02', name: 'Nurse Priya V.', type: 'Medical', team: 'Medical Team 02', phone: '+91 98765 22222', status: 'AVAILABLE', lat: 12.9720, lng: 77.5950, currentAssignment: null },
    { responderId: 'RESP-03', name: 'Officer Vikram Singh', type: 'Fire', team: 'Fire Squad 01', phone: '+91 98765 33333', status: 'AVAILABLE', lat: 12.9730, lng: 77.6010, currentAssignment: null },
    { responderId: 'RESP-04', name: 'Capt. Rajesh Kumar', type: 'Fire', team: 'Fire Squad 02', phone: '+91 98765 44444', status: 'AVAILABLE', lat: 12.9690, lng: 77.5890, currentAssignment: null },
    { responderId: 'RESP-05', name: 'Commander Suresh R.', type: 'Security', team: 'Security Team 01', phone: '+91 98765 55555', status: 'BUSY', lat: 12.9696, lng: 77.5944, currentAssignment: 'INC-1002' },
    { responderId: 'RESP-06', name: 'Insp. Sunita Patel', type: 'Security', team: 'Security Team 02', phone: '+91 98765 66666', status: 'AVAILABLE', lat: 12.9715, lng: 77.5942, currentAssignment: null },
    { responderId: 'RESP-07', name: 'Officer Amit Verma', type: 'Security', team: 'Security Team 03', phone: '+91 98765 77777', status: 'AVAILABLE', lat: 12.9735, lng: 77.5955, currentAssignment: null },
    { responderId: 'RESP-08', name: 'Officer Deepa Nair', type: 'Security', team: 'Security Team 04', phone: '+91 98765 88888', status: 'AVAILABLE', lat: 12.9700, lng: 77.5938, currentAssignment: null }
  ],
  missingPersons: [
    {
      caseId: 'MP-2026-01',
      name: 'Rohan Gupta',
      age: 7,
      gender: 'Male',
      description: 'Fair complexion, curly dark hair, wearing a small blue backpack',
      clothing: 'Red superhero T-shirt, blue denim shorts, white sneakers',
      photoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=300&q=80',
      lastSeenLocation: 'Zone B Food Court Ice Cream Stand',
      lastSeenTime: '21:15 PM',
      contactName: 'Sunil Gupta (Father)',
      contactPhone: '+91 98111 22334',
      status: 'SEARCHING',
      sightings: [
        { reporterName: 'Security Desk Gate B', location: 'Near Toy Stall Gate B', notes: 'Child matching description seen walking with security officer toward information tent', timestamp: new Date(Date.now() - 10 * 60000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 45 * 60000).toISOString()
    }
  ],
  alerts: [
    { id: 'ALT-01', title: 'High Density Warning in Zone C', level: 'ORANGE', zone: 'Zone C', message: 'North Lawn density reached 91%. Please use Gate B or Gate D for egress.', active: true, createdAt: new Date(Date.now() - 12 * 60000).toISOString() },
    { id: 'ALT-02', title: 'Medical Response in Progress', level: 'YELLOW', zone: 'Zone B', message: 'First aid team dispatched to Food Court stall #4. Clear emergency access lane.', active: true, createdAt: new Date(Date.now() - 14 * 60000).toISOString() },
    { id: 'ALT-03', title: 'Gate C Congestion', level: 'YELLOW', zone: 'Gate C', message: 'Gate C turnstiles experiencing high flow. Gate A and Gate B remain clear.', active: true, createdAt: new Date(Date.now() - 25 * 60000).toISOString() },
    { id: 'ALT-04', title: 'All Safety Stations Operational', level: 'GREEN', zone: 'All Zones', message: 'All 24 security points and 4 medical stations active and fully staffed.', active: true, createdAt: new Date(Date.now() - 120 * 60000).toISOString() }
  ]
};

// Secret JWT key
const JWT_SECRET = process.env.JWT_SECRET || 'crowd_safe_super_secret_jwt_key_2026_hackathon';

// Helper Token Generator
const generateToken = (user) => {
  return jwt.sign({ id: user.id || user.email, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '12h' });
};

// Auth API Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  // Demo login for any user or preset credentials
  const selectedRole = role || (email.includes('admin') ? 'Admin' : email.includes('organizer') ? 'Organizer' : email.includes('medical') ? 'Medical Responder' : email.includes('fire') ? 'Fire Responder' : email.includes('security') ? 'Security' : 'Visitor');
  const user = {
    id: 'user_' + Date.now(),
    name: email ? email.split('@')[0].toUpperCase() : 'DEMO USER',
    email: email || 'user@crowdsafe.org',
    role: selectedRole
  };
  const token = generateToken(user);
  res.json({ success: true, token, user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const user = { id: 'user_' + Date.now(), name, email, role: role || 'Visitor', phone };
  const token = generateToken(user);
  res.json({ success: true, token, user });
});

// REST API Routes
app.get('/api/events', (req, res) => res.json(mockStore.event));
app.get('/api/zones', (req, res) => res.json(mockStore.zones));
app.get('/api/facilities', (req, res) => res.json(mockStore.facilities));
app.get('/api/exits', (req, res) => res.json(mockStore.exits));
app.get('/api/incidents', (req, res) => res.json(mockStore.incidents));
app.get('/api/responders', (req, res) => res.json(mockStore.responders));
app.get('/api/missing-persons', (req, res) => res.json(mockStore.missingPersons));
app.get('/api/alerts', (req, res) => res.json(mockStore.alerts));

// Incident reporting API
app.post('/api/incidents', (req, res) => {
  const { type, severity, locationName, zone, lat, lng, description, reporterPhone, photoUrl } = req.body;
  
  // Duplicate check logic (same category + close coordinates + recent time)
  const isDuplicate = mockStore.incidents.some(i => 
    i.type === type &&
    Math.abs(i.lat - lat) < 0.001 &&
    Math.abs(i.lng - lng) < 0.001 &&
    (Date.now() - new Date(i.createdAt).getTime()) < 10 * 60000
  );

  const newIncident = {
    incidentId: 'INC-' + (1000 + mockStore.incidents.length + 1),
    type: type || 'Medical',
    severity: severity || 'MEDIUM',
    locationName: locationName || 'Event Grounds',
    zone: zone || 'Zone A',
    lat: lat || 12.9716,
    lng: lng || 77.5946,
    description: description || 'Public incident reported',
    photoUrl: photoUrl || null,
    reporterPhone: reporterPhone || null,
    verificationStatus: 'UNVERIFIED',
    status: 'Reported',
    assignedResponderId: null,
    assignedResponderName: null,
    isDuplicateFlagged: isDuplicate,
    createdAt: new Date().toISOString()
  };

  mockStore.incidents.unshift(newIncident);
  io.emit('incident_created', newIncident);
  res.status(201).json({ success: true, incident: newIncident, isDuplicateFlagged: isDuplicate });
});

// Update Incident Status & Verification API
app.patch('/api/incidents/:id', (req, res) => {
  const { id } = req.params;
  const { verificationStatus, status, assignedResponderId, assignedResponderName } = req.body;
  const incident = mockStore.incidents.find(i => i.incidentId === id);
  if (!incident) return res.status(404).json({ message: 'Incident not found' });

  if (verificationStatus) incident.verificationStatus = verificationStatus;
  if (status) incident.status = status;
  if (assignedResponderId !== undefined) incident.assignedResponderId = assignedResponderId;
  if (assignedResponderName !== undefined) incident.assignedResponderName = assignedResponderName;

  if (verificationStatus === 'VERIFIED') {
    // Also create a public alert if verified
    const alert = {
      id: 'ALT-' + Date.now(),
      title: `${incident.type.toUpperCase()} - ${incident.locationName}`,
      level: incident.severity === 'CRITICAL' ? 'RED' : incident.severity === 'HIGH' ? 'ORANGE' : 'YELLOW',
      zone: incident.zone,
      message: `${incident.description}. Response team dispatched.`,
      active: true,
      createdAt: new Date().toISOString()
    };
    mockStore.alerts.unshift(alert);
    io.emit('alert_created', alert);
  }

  io.emit('incident_updated', incident);
  res.json({ success: true, incident });
});

// Exit status update API
app.patch('/api/exits/:id', (req, res) => {
  const { id } = req.params;
  const { status, currentCrowd, isRecommended } = req.body;
  const exit = mockStore.exits.find(e => e.exitId === id);
  if (!exit) return res.status(404).json({ message: 'Exit not found' });

  if (status) exit.status = status;
  if (currentCrowd !== undefined) exit.currentCrowd = currentCrowd;
  if (isRecommended !== undefined) exit.isRecommended = isRecommended;

  io.emit('exit_status_changed', exit);
  res.json({ success: true, exit });
});

// Missing Person POST API
app.post('/api/missing-persons', (req, res) => {
  const { name, age, gender, description, clothing, photoUrl, lastSeenLocation, lastSeenTime, contactName, contactPhone } = req.body;
  const missing = {
    caseId: 'MP-2026-' + String(mockStore.missingPersons.length + 1).padStart(2, '0'),
    name, age: Number(age), gender, description, clothing, photoUrl,
    lastSeenLocation, lastSeenTime, contactName, contactPhone,
    status: 'SEARCHING',
    sightings: [],
    createdAt: new Date().toISOString()
  };
  mockStore.missingPersons.unshift(missing);
  io.emit('missing_person_created', missing);
  res.status(201).json({ success: true, missingPerson: missing });
});

// Missing Person Add Sighting API
app.post('/api/missing-persons/:id/sighting', (req, res) => {
  const { id } = req.params;
  const { reporterName, reporterPhone, location, notes } = req.body;
  const caseItem = mockStore.missingPersons.find(m => m.caseId === id);
  if (!caseItem) return res.status(404).json({ message: 'Case not found' });

  const sighting = { reporterName, reporterPhone, location, notes, timestamp: new Date().toISOString() };
  caseItem.sightings.push(sighting);
  io.emit('missing_person_updated', caseItem);
  res.json({ success: true, sighting, caseItem });
});

// Socket.IO real-time event connections
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.emit('initial_state', mockStore);

  socket.on('trigger_demo_step', (stepIndex) => {
    // Live hackathon demo step trigger
    io.emit('demo_step_broadcast', stepIndex);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[CROWD SAFE Server] Running on port ${PORT}`);
});
