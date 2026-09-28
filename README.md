# CROWD SAFE — Real-Time Safety & Emergency Coordination Platform

**Tagline:** "Real-Time Safety & Emergency Coordination for Large Public Gatherings"

CROWD SAFE is a full-stack, real-time safety operations platform built for festivals, concerts, rallies, sports events, and public gatherings. It provides dual real-time interfaces: a **Public Safety Dashboard** for attendees and an **Organizer / Admin Command Center** for event coordinators and emergency response teams.

---

## Key Features & Highlights

### 1. PUBLIC DASHBOARD
- **Hero Safety Hub**: Live population counters (12,540 attendees), active responders (18), safety alerts (7), and safety points (24).
- **Interactive Live Map (Leaflet + OpenStreetMap)**: Color-coded SVG markers for Hospitals (Blue), Fire Stations (Blue), Medical Booths (Blue), Security Help Points (Purple), Open Exits (Green), Congested/Blocked Exits (Orange/Red), and Active Emergency Incidents (Red).
- **Geolocation "Near Me" Finder**: Calculates distances to nearby emergency services and hospitals sorted by nearest, with direct Call and Directions shortcuts.
- **One-Tap 🚨 EMERGENCY Button**: Floating drawer with 112 India emergency dialing, Medical, Fire, and Security triggers backed by strict confirmation dialogs.
- **Report Something**: Public reporting modal supporting 9 categories (Fire, Medical, Blocked Exit, Crowd Surge, Missing Person, Security, etc.) with automatic duplicate detection flags.
- **Reunification & Missing Person System**: Registration form, catalog search, and community "Report Sighting" log.
- **Intelligent Safe Exit Recommendation**: Dynamic algorithm evaluating exit status, crowd density, distance, and active hazards to recommend optimal evacuation paths.
- **Temporary Location Sharing**: Generates private 15-minute tracking links with expiration timers.
- **Responsive Mobile Interface**: Bottom navigation bar designed for quick single-thumb navigation.

### 2. ORGANIZER / ADMIN COMMAND CENTER
- **Overview Dashboard**: Real-time stats, open incidents queue, responders fleet, and central tactical control map.
- **Live Alerts Stream**: High-contrast right sidebar displaying RED (Critical), ORANGE (High), YELLOW (Warning), and GREEN (Safe) alerts.
- **Incident Verification System**: Review public reports with `[VERIFY]` or `[REJECT]` actions, responder assignment, and progress timeline.
- **Crowd & Zone Heatmap Monitoring**: Live capacity percentages, trend indicators (Increasing/Decreasing), and AI/YOLO camera vision integration architecture.
- **Exit Gate Control Panel**: Quick toggles (`OPEN`, `CONGESTED`, `BLOCKED`) that instantly broadcast updates to the public map via Socket.IO.
- **Responder Dispatch & Tracking**: Manage Medical, Fire, and Security units with status tracking (`AVAILABLE`, `RESPONDING`, `BUSY`).
- **Analytics Dashboard (Recharts)**: Crowd density by hour, incident distribution by category, and average response times.
- **One-Click Live Demo Simulator**: Automated 8-step presentation workflow for live hackathon demonstrations.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Leaflet, React-Leaflet, Socket.IO Client.
- **Backend**: Node.js, Express, Socket.IO, JWT Auth, Mongoose.
- **Database**: MongoDB (with seamless in-memory fallback layer when MongoDB is offline).

---

## Quick Start & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd crowd-safe
   ```

2. Install all dependencies for root, client, and server:
   ```bash
   npm run install-all
   ```

3. Configure environment variables (optional):
   Copy `.env.example` to `.env` in the `server` directory.

### Running the Application

- **Run Frontend Client (Vite)**:
  ```bash
  npm run dev:client
  ```
  Open your browser at `http://localhost:3000`.

- **Run Backend API & Socket Server (Node.js)**:
  ```bash
  npm run dev:server
  ```
  Backend runs at `http://localhost:5000`.

---

## Demo Presentation Guide (Hackathon Judges)

1. Open the **Command Center** by clicking "Command Center" in the top navigation bar or switching role to **Admin**.
2. Locate the floating **LIVE DEMO SIMULATOR** widget at the bottom-left corner.
3. Click **Step 1 Next** to trigger the 8-stage automated workflow:
   - **Step 1**: Crowd Surge in Zone B (Food Court capacity reaches 94%).
   - **Step 2**: Gate C Blocked (Exit status switches to BLOCKED, public map updates).
   - **Step 3**: Medical Incident Reported (Unconscious person reported).
   - **Step 4**: Unverified Fire Report Arrives.
   - **Step 5**: Admin Verifies Fire (Broadcasts RED Critical Alert).
   - **Step 6**: Dispatch Fire Responder (Fire Squad 01 assigned).
   - **Step 7**: Responder In-Transit & Arrived.
   - **Step 8**: Fire Containment & Resolution (Alerts updated to SAFE).
