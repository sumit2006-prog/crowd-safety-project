import React, { useState } from 'react';
import { User, Search, PlusCircle, Eye, Phone, MapPin, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const MissingPersonSection = () => {
  const { missingPersons, addMissingPerson, addSighting } = useEventData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sightingModalCase, setSightingModalCase] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [description, setDescription] = useState('');
  const [clothing, setClothing] = useState('');
  const [lastSeenLocation, setLastSeenLocation] = useState('');
  const [lastSeenTime, setLastSeenTime] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Sighting Form State
  const [sightingLocation, setSightingLocation] = useState('');
  const [sightingNotes, setSightingNotes] = useState('');
  const [sightingReporter, setSightingReporter] = useState('');

  const handleRegisterMissing = (e) => {
    e.preventDefault();
    if (!name || !age || !lastSeenLocation) return;

    addMissingPerson({
      name,
      age: Number(age),
      gender,
      description,
      clothing,
      lastSeenLocation,
      lastSeenTime: lastSeenTime || 'Recent',
      contactName,
      contactPhone,
      photoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=300&q=80'
    });

    setIsFormOpen(false);
    setName('');
    setAge('');
    setDescription('');
  };

  const handleSightingSubmit = (e) => {
    e.preventDefault();
    if (!sightingModalCase || !sightingNotes) return;

    addSighting(sightingModalCase.caseId, {
      reporterName: sightingReporter || 'Anonymous Visitor',
      location: sightingLocation || 'Near Main Gate',
      notes: sightingNotes
    });

    setSightingModalCase(null);
    setSightingNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono mb-2">
            <User className="w-3.5 h-3.5" /> REUNIFICATION & MISSING PERSONS
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">MISSING PERSON DIRECTORY</h2>
          <p className="text-xs text-slate-400">Report missing family or sightings. Authorized staff coordinate active search.</p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-600/30 text-xs transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>REPORT MISSING PERSON</span>
        </button>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {missingPersons.map(person => (
          <div
            key={person.caseId}
            className="bg-slate-900/80 border border-purple-500/20 rounded-3xl overflow-hidden shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                  {person.caseId}
                </span>
                <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                  person.status === 'FOUND' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400 animate-pulse'
                }`}>
                  {person.status}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <img
                  src={person.photoUrl}
                  alt={person.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0"
                />
                <div>
                  <h3 className="text-lg font-black text-white">{person.name}</h3>
                  <p className="text-xs text-slate-300">{person.age} years old • {person.gender}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Last seen: <strong className="text-slate-200">{person.lastSeenTime}</strong></p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl space-y-1 text-xs">
                <div className="text-slate-400">📍 Location: <span className="text-slate-200 font-semibold">{person.lastSeenLocation}</span></div>
                <div className="text-slate-400">👕 Clothing: <span className="text-slate-200">{person.clothing}</span></div>
                <div className="text-slate-400">📝 Notes: <span className="text-slate-300">{person.description}</span></div>
              </div>

              {/* Sighting Count badge */}
              {person.sightings.length > 0 && (
                <div className="bg-purple-950/40 border border-purple-500/30 p-2.5 rounded-xl text-xs text-purple-300 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {person.sightings.length} Sighting(s) Reported:
                  </div>
                  <p className="text-[11px] italic text-slate-300">"{person.sightings[person.sightings.length - 1].notes}"</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2">
              <button
                onClick={() => setSightingModalCase(person)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs rounded-xl border border-purple-500/30 flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                <span>Report Sighting</span>
              </button>

              <a
                href={`tel:${person.contactPhone}`}
                className="flex items-center justify-center p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
                title={`Call Contact (${person.contactName})`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Report Missing Person Registration Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-white">FILE MISSING PERSON REPORT</h3>
            <form onSubmit={handleRegisterMissing} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Age</label>
                  <input type="number" value={age} onChange={e=>setAge(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Gender</label>
                  <select value={gender} onChange={e=>setGender(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Clothing Description</label>
                <input type="text" value={clothing} onChange={e=>setClothing(e.target.value)} placeholder="e.g. Red hoodie, black sneakers" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Last Seen Location & Time</label>
                <input type="text" value={lastSeenLocation} onChange={e=>setLastSeenLocation(e.target.value)} placeholder="e.g. Near Food Stall #4 at 21:00 PM" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Physical Features / Details</label>
                <textarea rows={2} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Height, hair color, distinct features..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Contact Name</label>
                  <input type="text" value={contactName} onChange={e=>setContactName(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Contact Phone</label>
                  <input type="tel" value={contactPhone} onChange={e=>setContactPhone(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button type="button" onClick={()=>setIsFormOpen(false)} className="py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="py-2.5 bg-purple-600 text-white rounded-xl font-bold">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sighting Submission Modal */}
      {sightingModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">REPORT SIGHTING FOR {sightingModalCase.name}</h3>
            <form onSubmit={handleSightingSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Sighting Location</label>
                <input type="text" value={sightingLocation} onChange={e=>setSightingLocation(e.target.value)} placeholder="e.g. Near Information Booth Gate B" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Observation Notes</label>
                <textarea rows={3} value={sightingNotes} onChange={e=>setSightingNotes(e.target.value)} placeholder="What was the person doing? Who were they with?" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Your Name (Optional)</label>
                <input type="text" value={sightingReporter} onChange={e=>setSightingReporter(e.target.value)} placeholder="Visitor Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button type="button" onClick={()=>setSightingModalCase(null)} className="py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="py-2.5 bg-purple-600 text-white rounded-xl font-bold">Submit Sighting</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
