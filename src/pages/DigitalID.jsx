import { useState } from 'react';
import { CreditCard, Check, User, Phone, Globe, Heart, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function DigitalID() {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    country: profile?.country || '',
    phone: profile?.phone || '',
    emergency_contact_name: profile?.emergency_contact_name || '',
    emergency_contact_phone: profile?.emergency_contact_phone || '',
    blood_type: profile?.blood_type || '',
    medical_conditions: profile?.medical_conditions || '',
  });

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blockchain Digital ID</h1>
          <p className="text-gray-600">Your secure, verifiable digital identity for emergency situations</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">SafeTour Digital ID</h2>
                <p className="text-sm opacity-90">Blockchain Verified</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span className="font-semibold">Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm opacity-75 mb-1">Full Name</p>
              <p className="text-xl font-bold">{profile.full_name}</p>
            </div>
            <div>
              <p className="text-sm opacity-75 mb-1">Digital ID Number</p>
              <p className="text-lg font-mono">{profile.digital_id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="opacity-75">Member Since</p>
              <p className="font-semibold">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="opacity-75">Status</p>
              <p className="font-semibold capitalize">{profile.safety_status}</p>
            </div>
            <div>
              <p className="opacity-75">Verification Level</p>
              <p className="font-semibold">Level 3 - Maximum</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Edit Information
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      country: profile?.country || '',
                      phone: profile?.phone || '',
                      emergency_contact_name: profile?.emergency_contact_name || '',
                      emergency_contact_phone: profile?.emergency_contact_phone || '',
                      blood_type: profile?.blood_type || '',
                      medical_conditions: profile?.medical_conditions || '',
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <input
                type="text"
                value={profile.full_name}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Globe className="h-4 w-4" />
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                placeholder="Enter your country"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Heart className="h-4 w-4" />
                Blood Type
              </label>
              <select
                value={formData.blood_type}
                onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Emergency Contact Information (Close Relative)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Close Relative Name
                </label>
                <input
                  type="text"
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  placeholder="Relative's name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Close Relative Number
                </label>
                <input
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <AlertCircle className="h-4 w-4" />
              Medical Conditions / Allergies
            </label>
            <textarea
              value={formData.medical_conditions}
              onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50"
              rows={3}
              placeholder="List any medical conditions, allergies, or important medical information..."
            />
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">Blockchain Verification Features</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Tamper-proof digital identity stored on distributed ledger</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Instantly verifiable by emergency services and authorities</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Encrypted personal information accessible only in emergencies</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Decentralized storage ensures data availability worldwide</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
