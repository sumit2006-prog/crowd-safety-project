export const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Crowd Surge in Zone B",
    description: "Food Court density surges to 94%. Zone status escalates to CRITICAL.",
    action: (state, updateState) => {
      const updatedZones = state.zones.map(z => 
        z.code === 'Zone B' ? { ...z, currentCrowd: 4700, densityPercentage: 94, status: 'CRITICAL', trend: 'INCREASING' } : z
      );
      const newAlert = {
        id: 'ALT-DEMO-1',
        title: 'CRITICAL CROWD SURGE - Zone B',
        level: 'RED',
        zone: 'Zone B',
        message: 'Food Court capacity exceeded 94%. Diverting incoming crowds to Zone F.',
        active: true,
        createdAt: new Date().toISOString()
      };
      updateState({
        zones: updatedZones,
        alerts: [newAlert, ...state.alerts]
      });
    }
  },
  {
    step: 2,
    title: "2. Exit C Blocked",
    description: "South Promenade Gate (Gate C) is obstructed. Recommended exit reroutes to Gate B.",
    action: (state, updateState) => {
      const updatedExits = state.exits.map(e => 
        e.exitId === 'gate-c' ? { ...e, status: 'BLOCKED', currentCrowd: 4500, isRecommended: false } : e
      );
      const newAlert = {
        id: 'ALT-DEMO-2',
        title: 'GATE C BLOCKED - USE GATE B',
        level: 'RED',
        zone: 'Gate C',
        message: 'Gate C exit turnstiles are physically blocked. Follow green illuminated exit arrows to Gate B.',
        active: true,
        createdAt: new Date().toISOString()
      };
      updateState({
        exits: updatedExits,
        alerts: [newAlert, ...state.alerts]
      });
    }
  },
  {
    step: 3,
    title: "3. Medical Incident Reported",
    description: "Public visitor reports an unconscious individual near Food Stall #9.",
    action: (state, updateState) => {
      const newIncident = {
        incidentId: 'INC-DEMO-99',
        type: 'Medical',
        severity: 'CRITICAL',
        locationName: 'Zone B Food Stall #9',
        zone: 'Zone B',
        lat: 12.9711,
        lng: 77.5944,
        description: 'Unconscious person collapsed near seating area. Immediate paramedic required.',
        verificationStatus: 'VERIFIED',
        status: 'Reported',
        assignedResponderId: null,
        assignedResponderName: null,
        createdAt: new Date().toISOString()
      };
      updateState({
        incidents: [newIncident, ...state.incidents]
      });
    }
  },
  {
    step: 4,
    title: "4. Unverified Fire Report Arrives",
    description: "Citizen submits emergency report: Smoke detected behind Stage Pavilion.",
    action: (state, updateState) => {
      const newIncident = {
        incidentId: 'INC-DEMO-FIRE',
        type: 'Fire',
        severity: 'CRITICAL',
        locationName: 'Zone C Pavilion Rear',
        zone: 'Zone C',
        lat: 12.9698,
        lng: 77.5948,
        description: 'Dense dark smoke observed near transformer unit.',
        verificationStatus: 'UNVERIFIED',
        status: 'Reported',
        assignedResponderId: null,
        assignedResponderName: null,
        createdAt: new Date().toISOString()
      };
      updateState({
        incidents: [newIncident, ...state.incidents]
      });
    }
  },
  {
    step: 5,
    title: "5. Admin Verifies Fire Emergency",
    description: "Command Center verifies Fire alert. Emergency alert broadcasts to public dashboard.",
    action: (state, updateState) => {
      const updatedIncidents = state.incidents.map(i => 
        i.incidentId === 'INC-DEMO-FIRE' ? { ...i, verificationStatus: 'VERIFIED', status: 'Verified' } : i
      );
      const fireAlert = {
        id: 'ALT-DEMO-FIRE',
        title: '🔥 VERIFIED FIRE ALERT - ZONE C',
        level: 'RED',
        zone: 'Zone C',
        message: 'Fire team dispatched to Zone C Pavilion. Evacuate Zone C towards Gate D immediately.',
        active: true,
        createdAt: new Date().toISOString()
      };
      updateState({
        incidents: updatedIncidents,
        alerts: [fireAlert, ...state.alerts]
      });
    }
  },
  {
    step: 6,
    title: "6. Dispatch Fire Responder",
    description: "Command Center assigns Fire Squad 01 (Capt. Vikram Singh) to scene.",
    action: (state, updateState) => {
      const updatedIncidents = state.incidents.map(i => 
        i.incidentId === 'INC-DEMO-FIRE' ? { ...i, status: 'Assigned', assignedResponderId: 'RESP-03', assignedResponderName: 'Officer Vikram Singh (Fire Squad 01)' } : i
      );
      const updatedResponders = state.responders.map(r => 
        r.responderId === 'RESP-03' ? { ...r, status: 'RESPONDING', currentAssignment: 'INC-DEMO-FIRE' } : r
      );
      updateState({
        incidents: updatedIncidents,
        responders: updatedResponders
      });
    }
  },
  {
    step: 7,
    title: "7. Responder In-Transit & Arrived",
    description: "Fire Squad 01 location moves to Zone C on map. Status changes to ARRIVED.",
    action: (state, updateState) => {
      const updatedIncidents = state.incidents.map(i => 
        i.incidentId === 'INC-DEMO-FIRE' ? { ...i, status: 'Arrived' } : i
      );
      const updatedResponders = state.responders.map(r => 
        r.responderId === 'RESP-03' ? { ...r, lat: 12.9698, lng: 77.5948, status: 'BUSY' } : r
      );
      updateState({
        incidents: updatedIncidents,
        responders: updatedResponders
      });
    }
  },
  {
    step: 8,
    title: "8. Fire Containment & Resolution",
    description: "Fire neutralized. Incident marked RESOLVED. All public alerts updated to SAFE.",
    action: (state, updateState) => {
      const updatedIncidents = state.incidents.map(i => 
        i.incidentId === 'INC-DEMO-FIRE' ? { ...i, status: 'Resolved' } : i
      );
      const updatedResponders = state.responders.map(r => 
        r.responderId === 'RESP-03' ? { ...r, status: 'AVAILABLE', currentAssignment: null } : r
      );
      const resolvedAlert = {
        id: 'ALT-DEMO-RESOLVED',
        title: '✅ FIRE CONTAINED - ZONE C SAFE',
        level: 'GREEN',
        zone: 'Zone C',
        message: 'Fire hazard fully extinguished and safety check verified by Fire Squad 01.',
        active: true,
        createdAt: new Date().toISOString()
      };
      updateState({
        incidents: updatedIncidents,
        responders: updatedResponders,
        alerts: [resolvedAlert, ...state.alerts]
      });
    }
  }
];
