import { Shield, MapPin, AlertTriangle, Database, Brain, Lock } from 'lucide-react';

export function Home({ onNavigate }) {
  const features = [
    {
      icon: Brain,
      title: 'AI Safety Monitoring',
      description: 'Real-time threat detection using advanced AI algorithms to keep you safe',
    },
    {
      icon: MapPin,
      title: 'Geo-Fencing Protection',
      description: 'Smart zone monitoring with instant alerts when entering restricted areas',
    },
    {
      icon: Lock,
      title: 'Blockchain Digital ID',
      description: 'Secure, verifiable digital identity for emergency situations',
    },
    {
      icon: AlertTriangle,
      title: 'Instant SOS Alert',
      description: 'One-tap emergency response system connecting you to local authorities',
    },
    {
      icon: Database,
      title: 'Incident Reporting',
      description: 'Quick incident documentation and real-time response tracking',
    },
    {
      icon: Shield,
      title: '24/7 Protection',
      description: 'Round-the-clock monitoring and safety status tracking',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 p-4 rounded-full">
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Smart Tourist Safety
            <span className="block text-blue-400 mt-2">Monitoring System</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Experience the future of travel safety with AI-powered monitoring, geo-fencing technology,
            and blockchain-secured digital identity. Your safety is our priority.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onNavigate('login')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-xl"
            >
              Get Started
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 shadow-xl"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition transform hover:scale-105 border border-white/20"
            >
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Travel Safely?
          </h2>
          <p className="text-xl text-blue-100 mb-6">
            Join thousands of travelers who trust SafeTour for their safety monitoring
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105 shadow-xl"
          >
            Create Your Account
          </button>
        </div>
      </div>
    </div>
  );
}
