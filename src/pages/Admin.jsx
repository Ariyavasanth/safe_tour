import { useEffect, useState } from 'react';
import { Users, AlertTriangle, MapPin, Activity, TrendingUp, Shield, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export function Admin() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalTourists: 0,
    activeIncidents: 0,
    totalAlerts: 0,
    safeTourists: 0,
    warningTourists: 0,
    riskTourists: 0,
  });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [tourists, setTourists] = useState([]);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const defaultMapCenter = { lat: 40.7589, lng: -73.9851 };

  useEffect(() => {
    if (profile?.is_admin) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    const { data: touristData } = await supabase
      .from('tourist_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: incidentData } = await supabase
      .from('incidents')
      .select('*, reporter:tourist_profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: alertData } = await supabase
      .from('safety_alerts')
      .select('*');

    if (touristData) {
      setTourists(touristData);
      setStats({
        totalTourists: touristData.length,
        activeIncidents: incidentData?.filter(i => i.status === 'open' || i.status === 'investigating').length || 0,
        totalAlerts: alertData?.length || 0,
        safeTourists: touristData.filter(t => t.safety_status === 'safe').length,
        warningTourists: touristData.filter(t => t.safety_status === 'warning').length,
        riskTourists: touristData.filter(t => t.safety_status === 'risk').length,
      });
    }

    if (incidentData) {
      setRecentIncidents(incidentData);
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor tourist safety and manage incidents across the platform</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <Users className="h-8 w-8 mb-3 opacity-80" />
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Tourists</h3>
            <p className="text-3xl font-bold">{stats.totalTourists}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <AlertTriangle className="h-8 w-8 mb-3 opacity-80" />
            <h3 className="text-sm font-medium opacity-90 mb-1">Active Incidents</h3>
            <p className="text-3xl font-bold">{stats.activeIncidents}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <Activity className="h-8 w-8 mb-3 opacity-80" />
            <h3 className="text-sm font-medium opacity-90 mb-1">Total Alerts</h3>
            <p className="text-3xl font-bold">{stats.totalAlerts}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <TrendingUp className="h-8 w-8 mb-3 opacity-80" />
            <h3 className="text-sm font-medium opacity-90 mb-1">Safe Tourists</h3>
            <p className="text-3xl font-bold">{stats.safeTourists}</p>
          </div>
        </div>

        {/* Safety Status & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Safety Status Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Safe</span>
                  <span className="text-sm font-bold text-green-600">{stats.safeTourists}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${stats.totalTourists ? (stats.safeTourists / stats.totalTourists) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Warning</span>
                  <span className="text-sm font-bold text-yellow-600">{stats.warningTourists}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full transition-all"
                    style={{ width: `${stats.totalTourists ? (stats.warningTourists / stats.totalTourists) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Risk</span>
                  <span className="text-sm font-bold text-red-600">{stats.riskTourists}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full transition-all"
                    style={{ width: `${stats.totalTourists ? (stats.riskTourists / stats.totalTourists) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Live Incident & Tourist Map</h2>
            <div className="flex-1 min-h-[300px] bg-slate-100 rounded-lg overflow-hidden relative border border-gray-200">
              {!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 bg-white/90 backdrop-blur text-gray-700">
                  <AlertTriangle className="h-10 w-10 text-yellow-500 mb-3" />
                  <p className="font-semibold">Map currently disabled</p>
                  <p className="text-sm">Please set VITE_GOOGLE_MAPS_API_KEY to view real-time mapping.</p>
                </div>
              ) : null}
              
              <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <Map
                  defaultZoom={11}
                  defaultCenter={defaultMapCenter}
                  mapId="ADMIN_MAP_ID"
                >
                  {/* Tourists */}
                  {tourists.filter(t => t.current_latitude && t.current_longitude).map((user) => (
                    <AdvancedMarker 
                      key={`user-${user.id}`} 
                      position={{ lat: Number(user.current_latitude), lng: Number(user.current_longitude) }}
                    >
                      <Pin 
                        background={user.safety_status === 'safe' ? '#10B981' : user.safety_status === 'warning' ? '#F59E0B' : '#EF4444'}
                        borderColor={'transparent'}
                        scale={0.8}
                      />
                    </AdvancedMarker>
                  ))}

                  {/* Incidents */}
                  {recentIncidents.filter(i => i.status !== 'resolved').map((incident) => (
                    <AdvancedMarker 
                      key={`inc-${incident.id}`} 
                      position={{ lat: Number(incident.latitude), lng: Number(incident.longitude) }}
                    >
                      <Pin background={'#DC2626'} borderColor={'#991B1B'} glyphColor={'#FFF'} scale={1.2} />
                    </AdvancedMarker>
                  ))}
                </Map>
              </APIProvider>
            </div>
            <div className="flex justify-between items-center mt-3 text-sm">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-600 rounded-full inline-block"></span> Incidents</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span> Safe Tourist</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span> Warning Status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Incidents Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Incidents</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Reporter</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Severity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No incidents reported
                    </td>
                  </tr>
                ) : (
                  recentIncidents.map((incident) => (
                    <tr key={incident.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {incident.reporter?.full_name || 'Unknown'}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{incident.incident_type}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          incident.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                          incident.status === 'investigating' ? 'bg-orange-100 text-orange-800' :
                          incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(incident.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Extended Registered Users Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Registered Users Portal</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
              {tourists.length} Total Users
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourists.map((tourist) => (
              <div key={tourist.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-gray-50">
                <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      {tourist.full_name}
                      {tourist.is_admin && <span className="bg-purple-100 text-purple-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Admin</span>}
                    </h3>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    tourist.safety_status === 'safe' ? 'bg-green-500' :
                    tourist.safety_status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} title={`Status: ${tourist.safety_status}`} />
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone</span>
                    <span className="font-medium text-gray-800">{tourist.phone || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Relative</span>
                    <span className="font-medium text-gray-800">{tourist.emergency_contact_phone || 'Not set'}</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 text-xs border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Last Activity:</span>
                    <span className="font-medium text-gray-700">{new Date(tourist.last_activity).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-gray-500">Location:</span>
                    {tourist.current_latitude && tourist.current_longitude ? (
                      <span className="font-mono text-blue-600">
                        {Number(tourist.current_latitude).toFixed(4)}, {Number(tourist.current_longitude).toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Unknown</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
