import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MapView } from './pages/MapView';
import { DigitalID } from './pages/DigitalID';
import { Incidents } from './pages/Incidents';
import { Admin } from './pages/Admin';
import { About } from './pages/About';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && currentPage === 'home') {
        setCurrentPage('dashboard');
      } else if (!user && ['dashboard', 'map', 'digital-id', 'incidents', 'admin'].includes(currentPage)) {
        setCurrentPage('login');
      }
    }
  }, [user, loading, currentPage]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading SafeTour...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
      {currentPage === 'about' && <About onNavigate={handleNavigate} />}
      {currentPage === 'dashboard' && user && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === 'map' && user && <MapView />}
      {currentPage === 'digital-id' && user && <DigitalID />}
      {currentPage === 'incidents' && user && <Incidents />}
      {currentPage === 'admin' && user && <Admin />}
    </div>
  );
}

export default App;
