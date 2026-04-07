import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Navigation({ currentPage, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleNavClick = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <Shield className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl hidden sm:inline">SafeTour</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <button onClick={() => handleNavClick('home')} className={`hover:text-blue-200 transition ${currentPage === 'home' ? 'text-blue-200' : ''}`}>
                  Home
                </button>
                <button onClick={() => handleNavClick('about')} className={`hover:text-blue-200 transition ${currentPage === 'about' ? 'text-blue-200' : ''}`}>
                  About
                </button>
                <button onClick={() => handleNavClick('login')} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
                  Login
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavClick('dashboard')} className={`hover:text-blue-200 transition ${currentPage === 'dashboard' ? 'text-blue-200' : ''}`}>
                  Dashboard
                </button>
                <button onClick={() => handleNavClick('map')} className={`hover:text-blue-200 transition ${currentPage === 'map' ? 'text-blue-200' : ''}`}>
                  Map
                </button>
                <button onClick={() => handleNavClick('digital-id')} className={`hover:text-blue-200 transition ${currentPage === 'digital-id' ? 'text-blue-200' : ''}`}>
                  Digital ID
                </button>
                <button onClick={() => handleNavClick('incidents')} className={`hover:text-blue-200 transition ${currentPage === 'incidents' ? 'text-blue-200' : ''}`}>
                  Incidents
                </button>
                {profile?.is_admin && (
                  <button onClick={() => handleNavClick('admin')} className={`hover:text-blue-200 transition ${currentPage === 'admin' ? 'text-blue-200' : ''}`}>
                    Admin
                  </button>
                )}
                <div className="flex items-center space-x-3">
                  <span className="text-sm">{profile?.full_name}</span>
                  <button onClick={signOut} className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!user ? (
              <>
                <button onClick={() => handleNavClick('home')} className="block w-full text-left py-2 hover:text-blue-200">
                  Home
                </button>
                <button onClick={() => handleNavClick('about')} className="block w-full text-left py-2 hover:text-blue-200">
                  About
                </button>
                <button onClick={() => handleNavClick('login')} className="block w-full text-left py-2 bg-white text-blue-600 rounded-lg font-semibold mt-2">
                  Login
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavClick('dashboard')} className="block w-full text-left py-2 hover:text-blue-200">
                  Dashboard
                </button>
                <button onClick={() => handleNavClick('map')} className="block w-full text-left py-2 hover:text-blue-200">
                  Map
                </button>
                <button onClick={() => handleNavClick('digital-id')} className="block w-full text-left py-2 hover:text-blue-200">
                  Digital ID
                </button>
                <button onClick={() => handleNavClick('incidents')} className="block w-full text-left py-2 hover:text-blue-200">
                  Incidents
                </button>
                {profile?.is_admin && (
                  <button onClick={() => handleNavClick('admin')} className="block w-full text-left py-2 hover:text-blue-200">
                    Admin
                  </button>
                )}
                <button onClick={signOut} className="block w-full text-left py-2 bg-red-500 rounded-lg font-semibold mt-2">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
