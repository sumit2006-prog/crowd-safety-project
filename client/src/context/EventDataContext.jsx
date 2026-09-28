import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MOCK_DATA } from '../services/mockData';
import { socket } from '../services/socket';
import { DEMO_STEPS } from '../services/demoSimulator';

const EventDataContext = createContext();

export const EventDataProvider = ({ children }) => {
  const [event, setEvent] = useState(INITIAL_MOCK_DATA.event);
  const [zones, setZones] = useState(INITIAL_MOCK_DATA.zones);
  const [facilities, setFacilities] = useState(INITIAL_MOCK_DATA.facilities);
  const [exits, setExits] = useState(INITIAL_MOCK_DATA.exits);
  const [incidents, setIncidents] = useState(INITIAL_MOCK_DATA.incidents);
  const [responders, setResponders] = useState(INITIAL_MOCK_DATA.responders);
  const [missingPersons, setMissingPersons] = useState(INITIAL_MOCK_DATA.missingPersons);
  const [alerts, setAlerts] = useState(INITIAL_MOCK_DATA.alerts);

  const [currentDemoStep, setCurrentDemoStep] = useState(0);
  const [toastNotification, setToastNotification] = useState(null);
  const [activeLocationShares, setActiveLocationShares] = useState([]);

  // Socket listener setup
  useEffect(() => {
    socket.on('initial_state', (data) => {
      if (data) {
        if (data.event) setEvent(data.event);
        if (data.zones) setZones(data.zones);
        if (data.facilities) setFacilities(data.facilities);
        if (data.exits) setExits(data.exits);
        if (data.incidents) setIncidents(data.incidents);
        if (data.responders) setResponders(data.responders);
        if (data.missingPersons) setMissingPersons(data.missingPersons);
        if (data.alerts) setAlerts(data.alerts);
      }
    });

    socket.on('incident_created', (newInc) => {
      setIncidents(prev => [newInc, ...prev]);
      showToast(`New Incident Reported: ${newInc.type} at ${newInc.locationName}`, 'warning');
    });

    socket.on('incident_updated', (updatedInc) => {
      setIncidents(prev => prev.map(i => i.incidentId === updatedInc.incidentId ? updatedInc : i));
      showToast(`Incident ${updatedInc.incidentId} updated to ${updatedInc.status}`, 'info');
    });

    socket.on('alert_created', (newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
      showToast(`SAFETY ALERT: ${newAlert.title}`, newAlert.level === 'RED' ? 'error' : 'warning');
    });

    socket.on('exit_status_changed', (updatedExit) => {
      setExits(prev => prev.map(e => e.exitId === updatedExit.exitId ? updatedExit : e));
      showToast(`Exit Status Update: ${updatedExit.name} is now ${updatedExit.status}`, updatedExit.status === 'BLOCKED' ? 'error' : 'info');
    });

    socket.on('demo_step_broadcast', (stepIndex) => {
      executeDemoStep(stepIndex);
    });

    return () => {
      socket.off('initial_state');
      socket.off('incident_created');
      socket.off('incident_updated');
      socket.off('alert_created');
      socket.off('exit_status_changed');
      socket.off('demo_step_broadcast');
    };
  }, []);

  const showToast = (message, type = 'info') => {
    setToastNotification({ id: Date.now(), message, type });
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Helper State Modifiers (works both local and API socket)
  const reportIncident = (incidentData) => {
    // Duplicate detection rule: same category + nearby location + recent timestamp
    const isDuplicate = incidents.some(i => 
      i.type === incidentData.type &&
      Math.abs(i.lat - incidentData.lat) < 0.0015 &&
      Math.abs(i.lng - incidentData.lng) < 0.0015 &&
      (Date.now() - new Date(i.createdAt).getTime()) < 10 * 60000
    );

    const newInc = {
      incidentId: 'INC-' + Math.floor(1000 + Math.random() * 9000),
      type: incidentData.type || 'Medical',
      severity: incidentData.severity || 'MEDIUM',
      locationName: incidentData.locationName || 'Event Venue',
      zone: incidentData.zone || 'Zone A',
      lat: incidentData.lat || 12.9716,
      lng: incidentData.lng || 77.5946,
      description: incidentData.description || 'Public user submitted report',
      photoUrl: incidentData.photoUrl || null,
      reporterPhone: incidentData.reporterPhone || null,
      verificationStatus: 'UNVERIFIED',
      status: 'Reported',
      assignedResponderId: null,
      assignedResponderName: null,
      isDuplicateFlagged: isDuplicate,
      createdAt: new Date().toISOString()
    };

    setIncidents(prev => [newInc, ...prev]);
    socket.emit('incident_created', newInc);
    showToast(isDuplicate ? 'Report submitted (Flagged as possible duplicate)' : 'Report submitted! Awaiting organizer verification.', isDuplicate ? 'warning' : 'success');
    return newInc;
  };

  const updateIncidentVerification = (incidentId, verificationStatus, assignedResponderId = null) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.incidentId !== incidentId) return inc;
      const responder = responders.find(r => r.responderId === assignedResponderId);
      const updated = {
        ...inc,
        verificationStatus,
        status: verificationStatus === 'VERIFIED' ? (assignedResponderId ? 'Assigned' : 'Verified') : 'Rejected',
        assignedResponderId: assignedResponderId || inc.assignedResponderId,
        assignedResponderName: responder ? `${responder.team} (${responder.name})` : inc.assignedResponderName
      };

      if (verificationStatus === 'VERIFIED') {
        // Automatically broadcast alert
        const newAlert = {
          id: 'ALT-' + Date.now(),
          title: `${inc.type.toUpperCase()} - ${inc.locationName}`,
          level: inc.severity === 'CRITICAL' ? 'RED' : inc.severity === 'HIGH' ? 'ORANGE' : 'YELLOW',
          zone: inc.zone,
          message: `${inc.description}. Responders alerted.`,
          active: true,
          createdAt: new Date().toISOString()
        };
        setAlerts(a => [newAlert, ...a]);
      }
      return updated;
    }));

    if (assignedResponderId) {
      setResponders(prev => prev.map(r => r.responderId === assignedResponderId ? { ...r, status: 'RESPONDING', currentAssignment: incidentId } : r));
    }

    showToast(`Incident ${incidentId} marked ${verificationStatus}`, verificationStatus === 'VERIFIED' ? 'success' : 'info');
  };

  const updateIncidentStatus = (incidentId, status) => {
    setIncidents(prev => prev.map(i => i.incidentId === incidentId ? { ...i, status } : i));
    showToast(`Incident ${incidentId} updated to ${status}`, 'info');
  };

  const updateExitStatus = (exitId, newStatus) => {
    setExits(prev => prev.map(e => e.exitId === exitId ? { ...e, status: newStatus } : e));
    showToast(`Gate status updated to ${newStatus}`, newStatus === 'BLOCKED' ? 'error' : 'success');
  };

  const addMissingPerson = (data) => {
    const newCase = {
      caseId: 'MP-2026-' + String(missingPersons.length + 1).padStart(2, '0'),
      ...data,
      status: 'SEARCHING',
      sightings: [],
      createdAt: new Date().toISOString()
    };
    setMissingPersons(prev => [newCase, ...prev]);
    showToast(`Missing Person case ${newCase.caseId} registered`, 'warning');
  };

  const addSighting = (caseId, sightingData) => {
    setMissingPersons(prev => prev.map(mp => {
      if (mp.caseId !== caseId) return mp;
      return {
        ...mp,
        sightings: [...mp.sightings, { ...sightingData, timestamp: new Date().toISOString() }]
      };
    }));
    showToast(`Sighting logged for case ${caseId}`, 'success');
  };

  const startLocationShare = (lat, lng, durationMinutes = 15) => {
    const shareToken = 'LOC-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const expiresAt = new Date(Date.now() + durationMinutes * 60000).toISOString();
    const newShare = { token: shareToken, lat, lng, expiresAt, durationMinutes };
    setActiveLocationShares(prev => [newShare, ...prev]);
    showToast(`Temporary 15-min location share created! Token: ${shareToken}`, 'success');
    return newShare;
  };

  const executeDemoStep = (stepNumber) => {
    const targetStepObj = DEMO_STEPS.find(s => s.step === stepNumber);
    if (!targetStepObj) return;

    setCurrentDemoStep(stepNumber);
    targetStepObj.action(
      { event, zones, facilities, exits, incidents, responders, missingPersons, alerts },
      (newState) => {
        if (newState.zones) setZones(newState.zones);
        if (newState.exits) setExits(newState.exits);
        if (newState.incidents) setIncidents(newState.incidents);
        if (newState.responders) setResponders(newState.responders);
        if (newState.alerts) setAlerts(newState.alerts);
      }
    );
    showToast(`[DEMO SIMULATOR] ${targetStepObj.title}`, 'info');
  };

  return (
    <EventDataContext.Provider value={{
      event, zones, facilities, exits, incidents, responders, missingPersons, alerts,
      toastNotification, currentDemoStep, activeLocationShares,
      reportIncident, updateIncidentVerification, updateIncidentStatus, updateExitStatus,
      addMissingPerson, addSighting, startLocationShare, executeDemoStep, showToast
    }}>
      {children}
    </EventDataContext.Provider>
  );
};

export const useEventData = () => useContext(EventDataContext);
