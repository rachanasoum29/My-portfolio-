import React, { useState, useEffect } from 'react';
import PortfolioWebsite from './components/PortfolioWebsite.jsx';
import AdminPanel from './components/AdminPanel.jsx';

export default function App() {
  // Determine initial view from window hash or default to 'portfolio'
  const [currentView, setCurrentView] = useState(() => {
    return window.location.hash === '#admin' ? 'admin' : 'portfolio';
  });

  // Keep window hash and view state synchronized
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('portfolio');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
  };

  const navigateToPortfolio = () => {
    window.location.hash = '#portfolio';
    setCurrentView('portfolio');
  };

  return (
    <div className="w-full min-h-screen">
      {currentView === 'admin' ? (
        <AdminPanel onNavigateToPortfolio={navigateToPortfolio} />
      ) : (
        <PortfolioWebsite onNavigateToAdmin={navigateToAdmin} />
      )}
    </div>
  );
}
