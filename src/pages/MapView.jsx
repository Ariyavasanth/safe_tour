import { useEffect, useState } from 'react';
import { Shield, Navigation, AlertTriangle, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export function MapView() {
  const { profile } = useAuth();
  const [geoFences, setGeoFences] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    fetchGeoFences();
  }, []);

  const fetchGeoFences = async () => {
    const { data } = await supabase
      .from('geo_fences')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setGeoFences(data);
  };

  const nearbyFacilities = [
    { name: 'City General Hospital', type: 'Hospital', distance: '1.2 km', lat: 40.7600, lng: -73.9800 },
    { name: 'Central Police Station', type: 'Police', distance: '0.8 km', lat: 40.7550, lng: -73.9900 },
    { name: 'Tourist Help Center', type: 'Tourist Info', distance: '0.5 km', lat: 40.7580, lng: -73.9820 },
    { name: 'Emergency Clinic', type: 'Medical', distance: '2.1 km', lat: 40.7650, lng: -73.9750 },
  ];

  // Default center if user location is not yet known
  const defaultCenter = { lat: 40.7589, lng: -73.9851 };
  const userLocation = profile?.current_latitude && profile?.current_longitude 
    ? { lat: Number(profile.current_latitude), lng: Number(profile.current_longitude) } 
    : defaultCenter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Safety Map & Geo-Fencing</h1>
          <p className="text-gray-600">Monitor safe zones, restricted areas, and nearby emergency facilities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                {!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 bg-white/90 backdrop-blur">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
                    <h2 className="text-lg font-bold text-gray-800">Google Maps API Key Missing</h2>
                    <p className="text-gray-600">Configure VITE_GOOGLE_MAPS_API_KEY in your .env file to enable the interactive map.</p>
                  </div>
                ) : null}
                
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                  <Map
                    defaultZoom={13}
                    defaultCenter={userLocation}
                    mapId="DEMO_MAP_ID"
                    disableDefaultUI={false}
                  >
                    {/* User Location Marker */}
                    {profile?.current_latitude && (
                      <AdvancedMarker position={userLocation}>
                        <Pin background={'#3B82F6'} borderColor={'#1D4ED8'} glyphColor={'#FFF'} />
                      </AdvancedMarker>
                    )}

                    {/* Geo Fences Markers */}
                    {geoFences.map((fence) => (
                      <AdvancedMarker 
                        key={fence.id} 
                        position={{ lat: Number(fence.latitude), lng: Number(fence.longitude) }}
                        onClick={() => setSelectedZone(fence)}
                      >
                         <Pin 
                           background={fence.zone_type === 'restricted' ? '#EF4444' : '#10B981'} 
                           borderColor={fence.zone_type === 'restricted' ? '#B91C1C' : '#047857'} 
                           glyphColor={'#FFF'} 
                         />
                      </AdvancedMarker>
                    ))}
                    
                    {/* Nearby Facilities */}
                    {nearbyFacilities.map((facility, idx) => (
                      <AdvancedMarker 
                        key={`fac-${idx}`} 
                        position={{ lat: facility.lat, lng: facility.lng }}
                      >
                         <Pin background={'#8B5CF6'} borderColor={'#5B21B6'} glyphColor={'#FFF'} />
                      </AdvancedMarker>
                    ))}
                  </Map>
                </APIProvider>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                  <span className="text-gray-700">Safe Zones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                  <span className="text-gray-700">Restricted Areas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  <span className="text-gray-700">Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full" />
                  <span className="text-gray-700">Facilities</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Geo-Fence Zones</h2>
              <div className="space-y-3">
                {geoFences.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No geo-fences configured</p>
                ) : (
                  geoFences.map((fence) => (
                    <div
                      key={fence.id}
                      onClick={() => setSelectedZone(selectedZone?.id === fence.id ? null : fence)}
                      className={`border-l-4 p-4 rounded-lg cursor-pointer transition ${
                        fence.zone_type === 'restricted'
                          ? 'border-red-500 bg-red-50 hover:bg-red-100'
                          : 'border-green-500 bg-green-50 hover:bg-green-100'
                      } ${selectedZone?.id === fence.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {fence.zone_type === 'restricted' ? (
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            ) : (
                              <Shield className="h-5 w-5 text-green-600" />
                            )}
                            <h3 className="font-semibold text-gray-900">{fence.name}</h3>
                          </div>
                          <p className="text-sm text-gray-700">{fence.description}</p>
                          <div className="mt-2 flex gap-4 text-xs text-gray-600">
                            <span>Radius: {fence.radius}m</span>
                            <span>Location: {Number(fence.latitude).toFixed(4)}, {Number(fence.longitude).toFixed(4)}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          fence.zone_type === 'restricted'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-green-200 text-green-800'
                        }`}>
                          {fence.zone_type}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-blue-600" />
                Nearby Facilities
              </h2>
              <div className="space-y-3">
                {nearbyFacilities.map((facility, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                    <h3 className="font-semibold text-gray-900 text-sm">{facility.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600">{facility.type}</span>
                      <span className="text-xs font-semibold text-blue-600">{facility.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-3">Safety Tips</h2>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Stay within designated safe zones when possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Avoid restricted areas marked in red</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Keep location services enabled for safety monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <Navigation className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Know the nearest emergency facilities</span>
                </li>
              </ul>
            </div>

            {selectedZone && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-purple-900 mb-2">Selected Zone</h2>
                <h3 className="font-semibold text-purple-800">{selectedZone.name}</h3>
                <p className="text-sm text-purple-700 mt-2">{selectedZone.description}</p>
                <div className="mt-4 space-y-1 text-sm text-purple-800">
                  <p><strong>Type:</strong> {selectedZone.zone_type}</p>
                  <p><strong>Radius:</strong> {selectedZone.radius} meters</p>
                  <p><strong>Coordinates:</strong> {Number(selectedZone.latitude).toFixed(4)}, {Number(selectedZone.longitude).toFixed(4)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
