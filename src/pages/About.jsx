import { Shield, Brain, Lock, MapPin, AlertTriangle, Users, Zap, Globe } from 'lucide-react';

export function About({ onNavigate }) {
  const technologies = [
    {
      icon: Brain,
      title: 'Artificial Intelligence',
      description: 'Machine learning algorithms analyze tourist behavior patterns, detect anomalies, and predict potential safety risks in real-time.',
    },
    {
      icon: MapPin,
      title: 'Geo-Fencing Technology',
      description: 'GPS-based virtual boundaries create safe zones and restricted areas, with instant alerts when boundaries are crossed.',
    },
    {
      icon: Lock,
      title: 'Blockchain Identity',
      description: 'Decentralized, tamper-proof digital identity system ensures secure verification and data integrity for emergency situations.',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Real-Time Safety Monitoring',
      description: 'Continuous tracking of tourist locations and safety status with AI-powered threat detection.',
    },
    {
      icon: AlertTriangle,
      title: 'Instant Emergency Response',
      description: 'One-tap SOS system immediately alerts authorities and emergency contacts with precise location data.',
    },
    {
      icon: Users,
      title: 'Collaborative Safety Network',
      description: 'Community-driven incident reporting helps keep all travelers informed about potential dangers.',
    },
    {
      icon: Zap,
      title: 'Predictive Analytics',
      description: 'AI algorithms analyze patterns to predict and prevent safety incidents before they occur.',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Works worldwide with local emergency services integration and multi-language support.',
    },
    {
      icon: Lock,
      title: 'Privacy-First Design',
      description: 'End-to-end encryption ensures your personal data remains secure and private at all times.',
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
            About SafeTour
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionizing tourist safety through cutting-edge technology and real-time monitoring
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 mb-16 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-4">
            SafeTour is dedicated to making travel safer for everyone through innovative technology.
            We combine Artificial Intelligence, Geo-Fencing, and Blockchain to create a comprehensive
            safety monitoring and emergency response system that protects tourists worldwide.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            Our platform provides real-time safety monitoring, instant emergency response capabilities,
            and a secure digital identity system that ensures travelers can explore the world with
            confidence and peace of mind.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Core Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 border-2 border-blue-400 hover:scale-105 transition transform"
              >
                <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <tech.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{tech.title}</h3>
                <p className="text-blue-100 leading-relaxed">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition"
              >
                <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 mb-16 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Sign Up & Create Profile</h3>
                <p className="text-gray-300">
                  Register with your details and create a secure blockchain-verified digital ID with emergency contact information.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Enable Location Tracking</h3>
                <p className="text-gray-300">
                  Allow the app to track your location for real-time safety monitoring and geo-fence protection.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Travel with Confidence</h3>
                <p className="text-gray-300">
                  Our AI monitors your safety 24/7, alerts you of potential risks, and provides instant emergency response when needed.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Report & Stay Connected</h3>
                <p className="text-gray-300">
                  Report incidents, receive community alerts, and contribute to making travel safer for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Travel Safely?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust SafeTour for their safety and security around the world
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onNavigate('login')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105 shadow-xl"
            >
              Get Started Now
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition transform hover:scale-105 shadow-xl border-2 border-white/20"
            >
              Back to Home
            </button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            SafeTour - Smart Tourist Safety Monitoring & Incident Response System
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Powered by AI, Geo-Fencing, and Blockchain Technology
          </p>
        </div>
      </div>
    </div>
  );
}
