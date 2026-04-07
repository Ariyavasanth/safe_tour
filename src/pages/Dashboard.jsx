import { useEffect, useState } from 'react';
import { Shield, AlertCircle, MapPin, Activity, Bell, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { sendSmsAlert, sendEmailAlert } from '../lib/notifications';

export function Dashboard({ onNavigate }) {
  const { profile, updateProfile } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [showSOS, setShowSOS] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchAlerts();
      updateLocation();
      const interval = setInterval(updateLocation, 30000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const fetchAlerts = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('safety_alerts')
      .select('*')
      .eq('tourist_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) setAlerts(data);
  };

  const updateLocation = () => {
    if (navigator.geolocation && profile) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await updateProfile({
            current_latitude: position.coords.latitude,
            current_longitude: position.coords.longitude,
            last_activity: new Date().toISOString(),
          });

          await supabase.from('location_history').insert({
            tourist_id: profile.id,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          checkSafetyConditions(position.coords.latitude, position.coords.longitude);
        },
        (error) => console.error('Location error:', error)
      );
    }
  };

  const checkSafetyConditions = async (lat, lng) => {
    if (!profile) return;

    const { data: geoFences } = await supabase
      .from('geo_fences')
      .select('*');

    if (geoFences) {
      for (const fence of geoFences) {
        const distance = calculateDistance(lat, lng, fence.latitude, fence.longitude);

        if (distance < fence.radius && fence.zone_type === 'restricted') {
          await supabase.from('safety_alerts').insert({
            tourist_id: profile.id,
            alert_type: 'geo_fence_breach',
            message: `You have entered a restricted zone: ${fence.name}`,
            severity: 'high',
          });

          await updateProfile({ safety_status: 'warning' });
          fetchAlerts();
        }
      }
    }

    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      await supabase.from('safety_alerts').insert({
        tourist_id: profile.id,
        alert_type: 'late_night_movement',
        message: 'Late night movement detected. Stay alert and be cautious.',
        severity: 'medium',
      });
      fetchAlerts();
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const handleSOS = async () => {
    if (!profile || !profile.current_latitude || !profile.current_longitude) return;

    await supabase.from('incidents').insert({
      reporter_id: profile.id,
      incident_type: 'SOS Emergency',
      description: 'Emergency SOS activated by user',
      latitude: profile.current_latitude,
      longitude: profile.current_longitude,
      severity: 'critical',
    });

    await supabase.from('safety_alerts').insert({
      tourist_id: profile.id,
      alert_type: 'sos_activated',
      message: 'SOS alert sent to authorities. Help is on the way!',
      severity: 'high',
    });

    await updateProfile({ safety_status: 'risk' });
    
    // Trigger external APIs (SMS & Email)
    if (profile.emergency_contact_phone) {
      await sendSmsAlert(
        profile.emergency_contact_phone, 
        `URGENT SOS: ${profile.full_name} has triggered an emergency alert. Last known location: https://maps.google.com/?q=${profile.current_latitude},${profile.current_longitude}`
      );
    }
    
    // (Optional) Send Email to a monitored system
    await sendEmailAlert(
      'emergency-response@safetour.com', 
      `SOS Activated - ${profile.full_name}`, 
      `User ${profile.full_name} triggered an SOS at coordinates: ${profile.current_latitude}, ${profile.current_longitude}`
    );

    setShowSOS(true);
    fetchAlerts();
    setTimeout(() => setShowSOS(false), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'risk': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'border-blue-500 bg-blue-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'high': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      {showSOS && (
        <div className="fixed inset-0 bg-red-600 bg-opacity-95 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <AlertCircle className="h-24 w-24 mx-auto mb-4 animate-pulse" />
            <h2 className="text-4xl font-bold mb-2">SOS ALERT SENT</h2>
            <p className="text-xl">Authorities have been notified</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {profile.full_name}</h1>
          <p className="text-gray-600">Your safety dashboard - Monitor your travel status in real-time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className={`w-4 h-4 rounded-full ${getStatusColor(profile.safety_status)}`} />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Safety Status</h3>
            <p className="text-2xl font-bold text-gray-900 capitalize">{profile.safety_status}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <MapPin className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-sm font-medium text-gray-600 mb-1">Current Location</h3>
            <p className="text-sm font-semibold text-gray-900">
              {profile.current_latitude && profile.current_longitude
                ? `${profile.current_latitude.toFixed(4)}, ${profile.current_longitude.toFixed(4)}`
                : 'Location unavailable'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <Activity className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-sm font-medium text-gray-600 mb-1">Last Activity</h3>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(profile.last_activity).toLocaleTimeString()}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <Bell className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="text-sm font-medium text-gray-600 mb-1">Active Alerts</h3>
            <p className="text-2xl font-bold text-gray-900">{alerts.filter(a => !a.is_read).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Safety Alerts</h2>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No alerts - You're safe!</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {alert.alert_type.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                        alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Emergency SOS</h2>
              <p className="text-sm mb-6 opacity-90">
                Press this button in case of emergency. Authorities will be immediately notified of your location.
              </p>
              <button
                onClick={handleSOS}
                className="w-full bg-white text-red-600 py-4 rounded-lg font-bold text-lg hover:bg-red-50 transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <AlertCircle className="h-6 w-6" />
                ACTIVATE SOS
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('map')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  View Safety Map
                </button>
                <button
                  onClick={() => onNavigate('digital-id')}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  View Digital ID
                </button>
                <button
                  onClick={() => onNavigate('incidents')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Report Incident
                </button>
              </div>
            </div>

            {profile.emergency_contact_phone && (
              <div className="bg-blue-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contact
                </h3>
                <p className="text-sm text-blue-800">{profile.emergency_contact_name}</p>
                <p className="text-sm font-semibold text-blue-900">{profile.emergency_contact_phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
