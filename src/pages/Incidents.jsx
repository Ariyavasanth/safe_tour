import { useState, useEffect } from 'react';
import { AlertTriangle, Send, Clock, CheckCircle, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function Incidents() {
  const { profile } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    incident_type: '',
    description: '',
    severity: 'medium',
  });

  useEffect(() => {
    if (profile) {
      fetchIncidents();
    }
  }, [profile]);

  const fetchIncidents = async () => {
    if (!profile) return;

    const { data } = await supabase
      .from('incidents')
      .select('*')
      .eq('reporter_id', profile.id)
      .order('created_at', { ascending: false });

    if (data) setIncidents(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return;

    const location = await getCurrentLocation();

    const { error } = await supabase.from('incidents').insert({
      reporter_id: profile.id,
      incident_type: formData.incident_type,
      description: formData.description,
      severity: formData.severity,
      latitude: location.lat,
      longitude: location.lng,
    });

    if (!error) {
      await supabase.from('safety_alerts').insert({
        tourist_id: profile.id,
        alert_type: 'incident_reported',
        message: `Your ${formData.incident_type} report has been submitted to authorities`,
        severity: 'medium',
      });

      setFormData({ incident_type: '', description: '', severity: 'medium' });
      setShowForm(false);
      fetchIncidents();
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => {
            resolve({
              lat: profile?.current_latitude || 0,
              lng: profile?.current_longitude || 0,
            });
          }
        );
      } else {
        resolve({
          lat: profile?.current_latitude || 0,
          lng: profile?.current_longitude || 0,
        });
      }
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'investigating':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'investigating':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Incident Reporting</h1>
          <p className="text-gray-600">Report and track safety incidents in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!showForm ? (
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white mb-6">
                <h2 className="text-2xl font-bold mb-3">Report a New Incident</h2>
                <p className="mb-6 opacity-90">
                  Witnessed or experienced a safety concern? Report it immediately to help keep everyone safe.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition flex items-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Create Incident Report
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">New Incident Report</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Incident Type
                    </label>
                    <select
                      required
                      value={formData.incident_type}
                      onChange={(e) => setFormData({ ...formData, incident_type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select incident type</option>
                      <option value="Theft">Theft</option>
                      <option value="Assault">Assault</option>
                      <option value="Harassment">Harassment</option>
                      <option value="Accident">Accident</option>
                      <option value="Medical Emergency">Medical Emergency</option>
                      <option value="Suspicious Activity">Suspicious Activity</option>
                      <option value="Lost/Found">Lost/Found</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity Level
                    </label>
                    <select
                      required
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="low">Low - Minor concern</option>
                      <option value="medium">Medium - Moderate concern</option>
                      <option value="high">High - Serious concern</option>
                      <option value="critical">Critical - Immediate danger</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      rows={5}
                      placeholder="Please provide detailed information about the incident..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Send className="h-5 w-5" />
                      Submit Report
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Incident Reports</h2>
              <div className="space-y-4">
                {incidents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No incidents reported yet</p>
                  </div>
                ) : (
                  incidents.map((incident) => (
                    <div key={incident.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(incident.status)}
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{incident.incident_type}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(incident.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{incident.description}</p>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>Location: {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</span>
                      </div>

                      {incident.response_notes && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mt-3">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Official Response:</p>
                          <p className="text-sm text-blue-800">{incident.response_notes}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Incident Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Reports</span>
                  <span className="text-2xl font-bold text-blue-600">{incidents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Open Cases</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {incidents.filter(i => i.status === 'open').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Resolved</span>
                  <span className="text-2xl font-bold text-green-600">
                    {incidents.filter(i => i.status === 'resolved').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Reporting Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-orange-800">
                <li>• Be as detailed and accurate as possible</li>
                <li>• Include time, location, and specific details</li>
                <li>• For emergencies, use the SOS button instead</li>
                <li>• Reports are reviewed within 30 minutes</li>
                <li>• False reports may result in account suspension</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="font-bold mb-3">Need Immediate Help?</h3>
              <p className="text-sm opacity-90 mb-4">
                If you're in immediate danger, use the emergency SOS button on your dashboard instead of filing a report.
              </p>
              <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition">
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
