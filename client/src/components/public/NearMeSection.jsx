import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Shield, Stethoscope, Flame, Search, Compass, CheckCircle } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const NearMeSection = () => {
  const { facilities, exits, event } = useEventData();
  const [userCoords, setUserCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Request browser geolocation
  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        () => {
          setUserCoords({ lat: event.centerLat, lng: event.centerLng });
          setIsLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setUserCoords({ lat: event.centerLat, lng: event.centerLng });
      setIsLocating(false);
    }
  };

  // Haversine distance formula
  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const currentLat = userCoords ? userCoords.lat : event.centerLat;
  const currentLng = userCoords ? userCoords.lng : event.centerLng;

  // Combine facilities & exits with calculated distance
  const allServices = [
    ...facilities.map(f => ({
      id: f.id,
      name: f.name,
      category: f.type,
      lat: f.lat,
      lng: f.lng,
      phone: f.phone,
      address: f.address,
      status: f.status,
      distanceKm: calculateDistanceKm(currentLat, currentLng, f.lat, f.lng)
    })),
    ...exits.map(e => ({
      id: e.exitId,
      name: e.name,
      category: 'Safe Exit',
      lat: e.lat,
      lng: e.lng,
      phone: '112',
      address: e.locationName,
      status: e.status,
      distanceKm: calculateDistanceKm(currentLat, currentLng, e.lat, e.lng)
    }))
  ].sort((a, b) => a.distanceKm - b.distanceKm);

  const categories = ['ALL', 'Hospital', 'Medical Booth', 'Fire Station', 'Police Station', 'Security Point', 'Safe Exit'];

  const filteredServices = selectedCategory === 'ALL'
    ? allServices
    : allServices.filter(s => s.category === selectedCategory);

  const formatDistance = (dist) => {
    if (dist < 1) return `${Math.round(dist * 1000)} m`;
    return `${dist.toFixed(1)} km`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono mb-2">
            <Compass className="w-3.5 h-3.5" /> GPS GEOLOCATION ACTIVE
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">NEARBY EMERGENCY HELP</h2>
          <p className="text-xs text-slate-400">Services sorted by physical proximity to your location.</p>
        </div>

        <button
          onClick={handleGetLocation}
          disabled={isLocating}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 text-xs transition-all"
        >
          <Compass className={`w-4 h-4 text-rose-400 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Refresh Location'}</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(item => (
          <div
            key={item.id}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-rose-400 border border-slate-700 rounded-full">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {formatDistance(item.distanceKm)} away
                </span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">{item.name}</h3>
              <p className="text-xs text-slate-400">{item.address}</p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <a
                href={`tel:${item.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              <a
                href={`https://maps.google.com/?q=${item.lat},${item.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-2 text-slate-400">
            <Search className="w-8 h-8 text-rose-500 mx-auto opacity-50" />
            <p className="text-sm font-bold text-white">No services found for this category</p>
            <p className="text-xs">Try selecting 'ALL' to view all nearby help stations.</p>
          </div>
        )}
      </div>
    </div>
  );
};
