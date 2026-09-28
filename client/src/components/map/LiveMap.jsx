import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Phone, Navigation, Shield, Flame, Stethoscope, AlertTriangle, Users, Compass, Eye, Filter, CheckCircle } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';
import { useAuth } from '../../context/AuthContext';

// Helper Map Controller to recenter map smoothly
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 16, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom DivIcon Marker Builder
const createCustomIcon = (colorHex, iconSymbol, label = '') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        background: ${colorHex};
        border: 2px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 4px 14px rgba(0,0,0,0.5);
        color: #ffffff;
        font-weight: bold;
        font-size: 16px;
      ">
        <span>${iconSymbol}</span>
        ${label ? `<span style="position: absolute; bottom: -18px; font-size: 9px; font-weight: 800; background: #0f172a; color: #ffffff; padding: 1px 5px; border-radius: 4px; border: 1px solid #334155; white-space: nowrap;">${label}</span>` : ''}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20]
  });
};

export const LiveMap = ({ fullScreen = true, filterCategory = 'ALL', onSelectFacility }) => {
  const { event, facilities, exits, incidents, responders, zones } = useEventData();
  const { isAdmin } = useAuth();
  const [mapCenter, setMapCenter] = useState([event.centerLat || 12.9716, event.centerLng || 77.5946]);
  const [userLocation, setUserLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState(filterCategory);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Recenter on user geolocation
  const handleRecenterMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(loc);
          setMapCenter(loc);
        },
        () => {
          setMapCenter([event.centerLat, event.centerLng]);
        }
      );
    }
  };

  const openExits = exits.filter(e => e.status === 'OPEN');
  const recommendedGate = openExits.length > 0
    ? openExits.sort((a, b) => a.currentCrowd - b.currentCrowd)[0]
    : null;

  const getMarkerColor = (type, severity, status) => {
    if (status === 'BLOCKED' || severity === 'CRITICAL') return '#ef4444'; // RED
    if (status === 'CONGESTED' || severity === 'HIGH') return '#f97316'; // ORANGE
    if (type === 'Hospital' || type === 'Ambulance' || type === 'Fire Station') return '#3b82f6'; // BLUE
    if (type === 'Security Point' || type === 'Police Station') return '#a855f7'; // PURPLE
    return '#10b981'; // GREEN
  };

  const getFacilityIconSymbol = (type) => {
    switch(type) {
      case 'Hospital': return '🏥';
      case 'Ambulance': return '🚑';
      case 'Fire Station': return '🔥';
      case 'Police Station': return '👮';
      case 'Medical Booth': return '🩺';
      case 'Security Point': return '🛡️';
      case 'Help Desk': return 'ℹ️';
      default: return '📍';
    }
  };

  return (
    <div className={`relative w-full ${fullScreen ? 'h-[calc(100vh-4rem)]' : 'h-[450px]'} rounded-2xl overflow-hidden border border-slate-800 shadow-2xl`}>

      {/* Filter & Control Bar */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl text-xs">
        <span className="text-slate-400 font-bold px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-rose-400" /> Filter:
        </span>
        {['ALL', 'EMERGENCY', 'SERVICES', 'EXITS', 'INCIDENTS'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeFilter === cat
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}

        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
            showHeatmap ? 'bg-purple-950 text-purple-300 border-purple-500/40' : 'bg-slate-800 text-slate-400 border-transparent'
          }`}
        >
          {showHeatmap ? '🔥 Crowd Heatmap ON' : 'Crowd Heatmap OFF'}
        </button>
      </div>

      {/* Recenter & Nearby Button */}
      <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleRecenterMe}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 font-bold rounded-xl shadow-xl backdrop-blur-md transition-all text-xs"
        >
          <Compass className="w-4 h-4 text-rose-400 animate-spin" />
          <span>Recenter on Me</span>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-6 left-4 z-[400] hidden md:flex items-center gap-3 px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md shadow-xl text-xs font-semibold">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span><span className="text-slate-300">Critical</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span><span className="text-slate-300">Warning</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-slate-300">Safe</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="text-slate-300">Medical/Fire</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500"></span><span className="text-slate-300">Security</span></div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={mapCenter}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapRecenter center={mapCenter} zoom={16} />

        {/* User Geolocation Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createCustomIcon('#0284c7', '🧍', 'YOU ARE HERE')}
          >
            <Popup>
              <div className="p-2 text-center font-bold text-sky-400">Your Current Geolocation</div>
            </Popup>
          </Marker>
        )}

        {/* Safe Evacuation Route Polyline visualization */}
        {recommendedGate && (
          <Polyline
            positions={[
              userLocation || [event.centerLat, event.centerLng],
              [recommendedGate.lat, recommendedGate.lng]
            ]}
            pathOptions={{
              color: '#10b981',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.9
            }}
          />
        )}

        {/* Crowd Density Zones / Heatmap circles */}
        {showHeatmap && zones.map(zone => {
          const zoneColor = zone.status === 'CRITICAL' ? '#ef4444' : zone.status === 'WARNING' ? '#f97316' : '#10b981';
          const centerLat = event.centerLat + (zone.code === 'Zone A' ? 0.001 : zone.code === 'Zone B' ? -0.0005 : zone.code === 'Zone C' ? -0.002 : 0.0008);
          const centerLng = event.centerLng + (zone.code === 'Zone A' ? -0.001 : zone.code === 'Zone B' ? 0.0005 : zone.code === 'Zone C' ? 0.001 : -0.0008);
          return (
            <Circle
              key={zone.code}
              center={[centerLat, centerLng]}
              radius={zone.densityPercentage * 2.5}
              pathOptions={{
                color: zoneColor,
                fillColor: zoneColor,
                fillOpacity: zone.densityPercentage / 250,
                weight: 1.5
              }}
            >
              <Popup>
                <div className="p-2 space-y-1">
                  <div className="font-bold text-white text-sm">{zone.name} ({zone.code})</div>
                  <div className="text-xs text-slate-300">Capacity: {zone.currentCrowd} / {zone.capacity}</div>
                  <div className="text-xs font-bold" style={{ color: zoneColor }}>Density: {zone.densityPercentage}% ({zone.status})</div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Facility & Emergency Markers */}
        {(activeFilter === 'ALL' || activeFilter === 'SERVICES' || activeFilter === 'EMERGENCY') && facilities.map(fac => {
          const color = getMarkerColor(fac.type, null, fac.status);
          const iconSymbol = getFacilityIconSymbol(fac.type);
          return (
            <Marker
              key={fac.id}
              position={[fac.lat, fac.lng]}
              icon={createCustomIcon(color, iconSymbol, fac.name.split(' ')[0])}
            >
              <Popup>
                <div className="p-3 space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                    <span className="font-bold text-white text-sm">{fac.name}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">{fac.type}</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-0.5">
                    <div>📍 Location: {fac.address || 'Event Perimeter'}</div>
                    <div>📞 Phone: <strong className="text-slate-100">{fac.phone}</strong></div>
                    <div>Status: <span className="font-bold text-emerald-400">{fac.status}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${fac.phone}`}
                      className="flex items-center justify-center gap-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg text-center"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <a
                      href={`https://maps.google.com/?q=${fac.lat},${fac.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-xs rounded-lg text-center"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Exit Gate Markers */}
        {(activeFilter === 'ALL' || activeFilter === 'EXITS') && exits.map(gate => {
          const color = gate.status === 'BLOCKED' ? '#ef4444' : gate.status === 'CONGESTED' ? '#f97316' : '#10b981';
          return (
            <Marker
              key={gate.exitId}
              position={[gate.lat, gate.lng]}
              icon={createCustomIcon(color, '🚪', gate.name.split('-')[0])}
            >
              <Popup>
                <div className="p-3 space-y-2 min-w-[200px]">
                  <div className="font-bold text-white text-sm flex items-center justify-between border-b border-slate-700 pb-1">
                    <span>{gate.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      gate.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' : gate.status === 'CONGESTED' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {gate.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <div>Location: {gate.locationName}</div>
                    <div>Crowd Flow: {gate.currentCrowd} / {gate.capacity}</div>
                    {gate.isRecommended && <div className="text-emerald-400 font-bold mt-1">✅ Recommended Safe Exit</div>}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Active Incident Markers */}
        {(activeFilter === 'ALL' || activeFilter === 'INCIDENTS' || activeFilter === 'EMERGENCY') && incidents.filter(i => i.status !== 'Resolved').map(inc => {
          const color = inc.severity === 'CRITICAL' ? '#ef4444' : '#f97316';
          return (
            <Marker
              key={inc.incidentId}
              position={[inc.lat, inc.lng]}
              icon={createCustomIcon(color, '🚨', inc.incidentId)}
            >
              <Popup>
                <div className="p-3 space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                    <span className="font-bold text-rose-400 text-xs">{inc.incidentId} ({inc.type})</span>
                    <span className="px-2 py-0.5 text-[10px] bg-red-500/20 text-red-400 font-bold rounded-full">{inc.severity}</span>
                  </div>
                  <p className="text-xs text-slate-200">{inc.description}</p>
                  <div className="text-[11px] text-slate-400">
                    <div>Status: <strong className="text-white">{inc.status}</strong> ({inc.verificationStatus})</div>
                    <div>Assigned: {inc.assignedResponderName || 'Unassigned'}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Responder Tracking Markers - Privacy Filtered for Visitors */}
        {responders.map(resp => (
          <Marker
            key={resp.responderId}
            position={[resp.lat, resp.lng]}
            icon={createCustomIcon(resp.type === 'Medical' ? '#0284c7' : resp.type === 'Fire' ? '#f97316' : '#a855f7', '🚓', resp.team.split(' ')[0])}
          >
            <Popup>
              <div className="p-2 text-xs space-y-1">
                <div className="font-bold text-sky-400">{isAdmin ? resp.name : resp.team} ({resp.type} Response)</div>
                <div className="text-slate-300">Status: <strong className="text-white">{resp.status}</strong></div>
                {isAdmin && resp.phone && <div className="text-slate-400">Phone: {resp.phone}</div>}
                {resp.currentAssignment && <div className="text-rose-400 font-bold">Assigned: {resp.currentAssignment}</div>}
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
};
